import { useEffect, useState, Fragment, ChangeEvent } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

interface Loan {
  id: number;
  user_id: number;
  amount: number;
  duration: string;
  interest_rate: number;
  total_to_pay: number;
  total_paid: number;
  status: string;
  created_at: string;
  approvedOn: string;
  guarantors:[];
  customer?: { name: string };
}


interface User {
  id: number;
  name: string;
}

interface LoanApplicationsProps {
  statusFilter?: 'pending' | 'approved' | 'rejected' | 'all';
}

export default function LoanApplications({ statusFilter = 'all' }: LoanApplicationsProps) {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    user_id: '',
    amount: '',
    duration: '',
    interest_rate: '', 
    guarantors: [] as number[],
  });
  const [errors, setErrors] = useState({ user_id: '', amount: '', duration: '' });

 

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [loanRes, userRes] = await Promise.all([
        axios.get('/api/loan-applications'),
        axios.get('/api/customers'),
      ]);

      let fetchedLoans: Loan[] = loanRes.data;

      if (statusFilter !== 'all') {
        fetchedLoans = fetchedLoans.filter(loan => loan.status === statusFilter);
      }
      setLoans(fetchedLoans);
      setUsers(userRes.data);
    } catch {
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({ user_id: '', amount: '', duration: '' ,interest_rate:'',guarantors:[]});
    setErrors({ user_id: '', amount: '', duration: '' });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {
      user_id: formData.user_id ? '' : 'Customer is required',
      amount: formData.amount ? '' : 'Amount is required',
      duration: formData.duration ? '' : 'Duration is required',
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const submitLoan = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await axios.post('/api/loan-applications', {
        ...formData,
        user_id: Number(formData.user_id),
      });
      toast.success('Loan application added!');
      setIsOpen(false);
      resetForm();
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add loan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteLoan = async (id: number) => {
    if (!confirm('Are you sure you want to delete this loan?')) return;
    try {
      await axios.delete(`/api/loan-applications/${id}`);
      toast.success('Loan deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete loan');
    }
  };

  const handleApprove = async (loanId: number) => {
    const result = await Swal.fire({
      title: 'Approve Loan?',
      text: 'Are you sure you want to approve this loan?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve it!',
      cancelButtonText: 'Cancel',
    });
  
    if (result.isConfirmed) {
      try {
        await axios.post(`/api/loan-applications/${loanId}/approve`);
        toast.success('Loan approved!');
        fetchData();
      } catch {
        toast.error('Failed to approve loan.');
      }
    }
  };
  
  const handleReject = async (loanId: number) => {
    const { value: reason } = await Swal.fire({
      title: 'Reject Loan?',
      input: 'textarea',
      inputLabel: 'Rejection Reason',
      inputPlaceholder: 'Type your reason here...',
      showCancelButton: true,
      confirmButtonText: 'Reject',
      inputValidator: (value) => {
        if (!value) {
          return 'Reason is required!';
        }
        return null;
      },
    });
  
    if (reason) {
      try {
        await axios.post(`/api/loan-applications/${loanId}/reject`, { reason });
        toast.success('Loan rejected.');
        fetchData();
      } catch {
        toast.error('Failed to reject loan.');
      }
    }
  };
  

  const handleModalClose = () => {
    const isDirty = Object.values(formData).some((v) => v !== '');
    if (isDirty) setConfirmClose(true);
    else {
      setIsOpen(false);
      resetForm();
    }
  };

  const confirmAndCloseModal = () => {
    resetForm();
    setIsOpen(false);
    setConfirmClose(false);
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Loans', href: '/loans' }]}>
      <Head title="Loan Applications" />

      <div className="p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Loan Applications</h2>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Add Loan
          </button>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-500">Loading data...</div>
        ) : (
          <table className="min-w-full table-auto border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Customer</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Interest %</th>
                <th className="px-4 py-2 border">Total To Pay</th>
                <th className="px-4 py-2 border">Total Paid</th>
                <th className="px-4 py-2 border">Duration</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Guarantors</th>
                <th className="px-4 py-2 border">Date Applied</th>
                <th className="px-4 py-2 border">Date Approved</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans.length > 0 ? (
                loans.map((loan) => (
                  <tr key={loan.id}>
                    <td className="px-4 py-2 border">
                      {loan.customer?.name || 'Unknown'}
                    </td>
                    <td className="px-4 py-2 border">KES {loan.amount}</td>
                    <td className="px-4 py-2 border">{loan.interest_rate} %</td>
                    <td className="px-4 py-2 border">KES {loan.total_to_pay}</td>
                    <td className="px-4 py-2 border">KES {loan.total_paid}</td>
                    <td className="px-4 py-2 border">{loan.duration} Days </td>
                    <td className="px-4 py-2 border">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            loan.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : loan.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {loan.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 border">
                        {loan.guarantors?.length
                          ? loan.guarantors.map(g => g.name).join(', ')
                          : 'No guarantors'}
                      </td>

                    <td className="px-4 py-2 border">
                      {new Date(loan.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border">
                      {loan.approvedOn
                        ? new Date(loan.approvedOn).toLocaleDateString()
                        : 'Not approved'}
                    </td>

                    <td className="px-4 py-2 border text-center space-x-2">
                      <button
                        className="text-green-600 hover:underline text-sm"
                        onClick={() => handleApprove(loan.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="text-yellow-600 hover:underline text-sm"
                        onClick={() => handleReject(loan.id)}
                      >
                        Reject
                      </button>
                      <button
                        className="text-red-600 hover:underline text-sm"
                        onClick={() => deleteLoan(loan.id)}
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No loan applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleModalClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 bg-opacity-10" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md p-6 bg-white rounded shadow-xl space-y-4">
                <Dialog.Title className="text-lg font-bold">
                  New Loan Application
                </Dialog.Title>

                <div className="space-y-3">
                  <div>
                    <select
                      name="user_id"
                      className="w-full border rounded p-2"
                      value={formData.user_id}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Customer</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                    {errors.user_id && (
                      <p className="text-red-600 text-sm">{errors.user_id}</p>
                    )}
                  </div>

                  <div>
                    <input
                      name="amount"
                      type="number"
                      placeholder="Loan Amount"
                      className="w-full border rounded p-2"
                      value={formData.amount}
                      onChange={handleInputChange}
                    />
                    {errors.amount && (
                      <p className="text-red-600 text-sm">{errors.amount}</p>
                    )}
                  </div>

                  <div>
                    <input
                      name="duration"
                      type="text"
                      placeholder="Duration (e.g. 6 Days)"
                      className="w-full border rounded p-2"
                      value={formData.duration}
                      onChange={handleInputChange}
                    />
                    {errors.duration && (
                      <p className="text-red-600 text-sm">{errors.duration}</p>
                    )}
                  </div>

                  <div>
                    <input
                      name="interest_rate"
                      type="number"
                      placeholder="Interest Rate (%)"
                      className="w-full border rounded p-2"
                      value={formData.interest_rate || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Guarantors</label>
                    <select
                      multiple
                      name="guarantors"
                      className="w-full border rounded p-2"
                      value={formData.guarantors.map(String)} // convert to string array for <select>
                      onChange={(e) => {
                        const options = Array.from(e.target.selectedOptions, (option) =>
                          parseInt(option.value)
                        );
                        setFormData((prev) => ({ ...prev, guarantors: options }));
                      }}
                    >
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>


                </div>

                <div className="flex justify-end gap-2">
                  <button className="px-4 py-2 bg-gray-300 rounded" onClick={handleModalClose}>
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                    onClick={submitLoan}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Dirty Form Confirmation */}
      <Transition appear show={confirmClose} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={() => setConfirmClose(false)}>
          <div className="fixed inset-0 bg-white/30 backdrop-blur-sm" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-sm p-6 bg-white rounded shadow-xl space-y-4">
              <Dialog.Title className="text-lg font-bold">Discard changes?</Dialog.Title>
              <p className="text-sm text-gray-600">
                You have unsaved changes. Are you sure you want to discard them?
              </p>
              <div className="flex justify-end gap-2">
                <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setConfirmClose(false)}>
                  Cancel
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={confirmAndCloseModal}>
                  Discard
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </AppLayout>
  );
}
