import { useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Pencil, Trash2, Eye, X } from 'lucide-react';

interface Customer {
    id: number;
    name: string;
    phone: string;
    id_number: string;
    created_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Customers', href: '/customers' },
];

export default function Customers() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [formData, setFormData] = useState({ name: '', phone: '', id_number: '' });

    const fetchCustomers = () => {
        axios.get('/api/customers').then((res) => setCustomers(res.data));
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const openAddModal = () => {
        setFormData({ name: '', phone: '', id_number: '' });
        setEditingCustomer(null);
        setIsViewMode(false);
        setIsModalOpen(true);
    };

    const openEditModal = (customer: Customer) => {
        setFormData({
            name: customer.name,
            phone: customer.phone,
            id_number: customer.id_number,
        });
        setEditingCustomer(customer);
        setIsViewMode(false);
        setIsModalOpen(true);
    };

    const openViewModal = (customer: Customer) => {
        setFormData({
            name: customer.name,
            phone: customer.phone,
            id_number: customer.id_number,
        });
        setEditingCustomer(customer);
        setIsViewMode(true);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCustomer(null);
        setFormData({ name: '', phone: '', id_number: '' });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCustomer) {
                await axios.put(`/api/customers/${editingCustomer.id}`, formData);
                toast.success('Customer updated successfully!');
            } else {
                try {
                    await axios.post('/api/customers', formData);
                    toast.success('Customer added successfully!');
                    // Optionally close modal or refresh list
                  } catch (error: any) {
                    toast.error(error.response?.data?.message || 'Failed to add customer.');
                  }
            }
            handleCloseModal();
            fetchCustomers();
        } catch (error) {
            alert('Error saving customer');
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this customer?')) {
            await axios.delete(`/api/customers/${id}`);
            fetchCustomers();
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customers" />
            <div className="flex flex-col gap-6 p-4 overflow-x-auto">
            <Toaster position="top-right" reverseOrder={false} />
                {/* Top */}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Customers</h2>
                    <button
                        onClick={openAddModal}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    >
                        + Add Customer
                    </button>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900">
                    <div className="overflow-auto">
                        <table className="min-w-full table-auto text-sm border border-gray-300 dark:border-gray-600">
                            <thead className="bg-gray-100 dark:bg-gray-800">
                                <tr>
                                    <th className="px-4 py-2 border">Name</th>
                                    <th className="px-4 py-2 border">Phone</th>
                                    <th className="px-4 py-2 border">ID Number</th>
                                    <th className="px-4 py-2 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td className="px-4 py-2 border">{customer.name}</td>
                                        <td className="px-4 py-2 border">{customer.phone}</td>
                                        <td className="px-4 py-2 border">{customer.id_number}</td>
                                        <td className="px-4 py-2 border flex gap-2 justify-center">
                                            <button
                                                onClick={() => openViewModal(customer)}
                                                className="text-blue-500 hover:text-blue-700"
                                                title="View"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => openEditModal(customer)}
                                                className="text-green-500 hover:text-green-700"
                                                title="Edit"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(customer.id)}
                                                className="text-red-500 hover:text-red-700"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {customers.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center p-4 text-gray-500">
                                            No customers found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md relative shadow-xl">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
                        >
                            <X />
                        </button>
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                            {isViewMode ? 'Customer Details' : editingCustomer ? 'Edit Customer' : 'Add Customer'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                disabled={isViewMode}
                                className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
                                required
                            />
                            <input
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleInputChange}
                                disabled={isViewMode}
                                className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
                                required
                            />
                            <input
                                name="id_number"
                                placeholder="ID Number"
                                value={formData.id_number}
                                onChange={handleInputChange}
                                disabled={isViewMode}
                                className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
                                required
                            />

                            {!isViewMode && (
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
                                >
                                    {editingCustomer ? 'Update' : 'Add'}
                                </button>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
