import { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

interface Loan {
  id: number;
  user_id: number;
  amount: number;
  duration: string;
  created_at: string;
}

interface User {
  id: number;
  name: string;
}

export default function LoanApplications() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  const [formData, setFormData] = useState({
    user_id: '',
    amount: '',
    duration: '',
  });

  const [errors, setErrors] = useState({
    user_id: '',
    amount: '',
    duration: '',
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [loansRes, usersRes] = await Promise.all([
        axios.get('/api/loan-applications'),
        axios.get('/api/customers'),
      ]);
      setLoans(loansRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({ user_id: '', amount: '', duration: '' });
    setErrors({ user_id: '', amount: '', duration: '' });
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
    } catch (err) {
      toast.error('Failed to delete loan');
    }
  };

  const isFormDirty = Object.values(formData).some((v) => v !== '');

  const handleModalClose = () => {
    if (isFormDirty) {
      setConfirmClose(true);
    } else {
      setIsOpen(false);
      resetForm();
    }
  };

  const confirmAndCloseModal = () => {
    setIsOpen(false);
    setConfirmClose(false);
    resetForm();
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
                <th className="px-4 py-2 border">User</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Duration</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id}>
                  <td className="px-4 py-2 border">
                    {users.find((u) => u.id === loan.user_id)?.name || 'Unknown'}
                  </td>
                  <td className="px-4 py-2 border">KES {loan.amount}</td>
                  <td className="px-4 py-2 border">{loan.duration}</td>
                  <td className="px-4 py-2 border">
                    {new Date(loan.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      className="text-red-600 hover:underline text-sm"
                      onClick={() => deleteLoan(loan.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {loans.length === 0 && (
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
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
           <div className="fixed inset-0 bg-white/30 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-md p-6 rounded bg-white shadow-xl space-y-4">
                <Dialog.Title className="text-lg font-bold">
                  New Loan Application
                </Dialog.Title>
                <div className="space-y-3">
                  <div>
                    <select
                      className="w-full border rounded p-2"
                      value={formData.user_id}
                      onChange={(e) =>
                        setFormData({ ...formData, user_id: e.target.value })
                      }
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
                      type="number"
                      placeholder="Loan Amount"
                      className="w-full border rounded p-2"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                    />
                    {errors.amount && (
                      <p className="text-red-600 text-sm">{errors.amount}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Duration (e.g. 6 months)"
                      className="w-full border rounded p-2"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                    />
                    {errors.duration && (
                      <p className="text-red-600 text-sm">{errors.duration}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded"
                    onClick={handleModalClose}
                  >
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
            <Dialog.Panel className="w-full max-w-sm p-6 rounded bg-white shadow-xl space-y-4">
              <Dialog.Title className="text-lg font-bold">Discard changes?</Dialog.Title>
              <p className="text-sm text-gray-600">
                You have unsaved changes. Are you sure you want to discard them?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setConfirmClose(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded"
                  onClick={confirmAndCloseModal}
                >
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
