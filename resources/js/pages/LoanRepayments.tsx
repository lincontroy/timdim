import { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

interface Repayment {
  id: number;
  loan_id: number;
  amount: number;
  method: string;
  date: string;
  reference?: string;
  loan?: { customer?: { name: string } };
}

export default function LoanRepayments() {
  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [form, setForm] = useState({
    loan_id: '',
    amount: '',
    method: '',
    date: '',
    reference: '',
  });
  const [errors, setErrors] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<null | number>(null);

  const fetchRepayments = async () => {
    try {
      const res = await axios.get('/api/loan-repayments');
      setRepayments(res.data);
    } catch {
      toast.error('Failed to load repayments');
    }
  };

  useEffect(() => {
    fetchRepayments();
  }, []);

  const openModal = (repayment?: Repayment) => {
    setErrors({});
    setIsOpen(true);
    if (repayment) {
      setForm({
        loan_id: repayment.loan_id.toString(),
        amount: repayment.amount.toString(),
        method: repayment.method,
        date: repayment.date,
        reference: repayment.reference || '',
      });
      setIsEditing(repayment.id);
    } else {
      setForm({ loan_id: '', amount: '', method: '', date: '', reference: '' });
      setIsEditing(null);
    }
  };

  const submit = async () => {
    try {
      if (isEditing) {
        await axios.put(`/api/loan-repayments/${isEditing}`, form);
        toast.success('Repayment updated');
      } else {
        await axios.post('/api/loan-repayments', form);
        toast.success('Repayment recorded');
      }
      setIsOpen(false);
      fetchRepayments();
    } catch (err: any) {
      setErrors(err.response?.data?.errors || {});
      toast.error('Validation failed');
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    await axios.delete(`/api/loan-repayments/${id}`);
    toast.success('Repayment deleted');
    fetchRepayments();
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Repayments', href: '/repayments' }]}>
      <Head title="Loan Repayments" />
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Loan Repayments</h2>
          <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded">
            ➕ New Repayment
          </button>
        </div>

        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Customer</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Method</th>
              <th className="border px-4 py-2">Ref</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {repayments.map((r) => (
              <tr key={r.id}>
                <td className="border px-4 py-2">{r.loan?.customer?.name || 'Unknown'}</td>
                <td className="border px-4 py-2">KES {r.amount}</td>
                <td className="border px-4 py-2">{r.date}</td>
                <td className="border px-4 py-2">{r.method}</td>
                <td className="border px-4 py-2">{r.reference || '-'}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button onClick={() => openModal(r)} className="text-blue-600 hover:underline text-sm">Edit</button>
                  <button onClick={() => remove(r.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                </td>
              </tr>
            ))}
            {repayments.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">No repayments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100">
            <div className="fixed inset-0 bg-black bg-opacity-20" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded shadow-lg space-y-4">
              <Dialog.Title className="text-lg font-bold">
                {isEditing ? 'Edit Repayment' : 'New Repayment'}
              </Dialog.Title>

              <div className="space-y-3">
                <input
                  type="number"
                  placeholder="Loan ID"
                  value={form.loan_id}
                  onChange={(e) => setForm({ ...form, loan_id: e.target.value })}
                  className="w-full border p-2 rounded"
                />
                {errors.loan_id && <p className="text-red-600 text-sm">{errors.loan_id}</p>}

                <input
                  type="number"
                  placeholder="Amount"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full border p-2 rounded"
                />
                {errors.amount && <p className="text-red-600 text-sm">{errors.amount}</p>}

                <input
                  type="text"
                  placeholder="Method (e.g. M-Pesa)"
                  value={form.method}
                  onChange={(e) => setForm({ ...form, method: e.target.value })}
                  className="w-full border p-2 rounded"
                />
                {errors.method && <p className="text-red-600 text-sm">{errors.method}</p>}

                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border p-2 rounded"
                />
                {errors.date && <p className="text-red-600 text-sm">{errors.date}</p>}

                <input
                  type="text"
                  placeholder="Reference (optional)"
                  value={form.reference}
                  onChange={(e) => setForm({ ...form, reference: e.target.value })}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button onClick={() => setIsOpen(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                <button onClick={submit} className="bg-blue-600 text-white px-4 py-2 rounded">
                  {isEditing ? 'Update' : 'Save'}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </AppLayout>
  );
}
