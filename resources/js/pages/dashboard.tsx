import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Dashboard" />
        <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 overflow-x-auto">
          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Customers */}
            <div className="rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 shadow-md">
              <h2 className="text-xl font-semibold">Customers</h2>
              <p className="mt-2 text-3xl font-bold">1,245</p>
              <span className="block mt-1 text-sm text-blue-100">Currently borrowing</span>
            </div>
      
            {/* Loans Disbursed This Week */}
            <div className="rounded-xl bg-gradient-to-r from-green-400 to-green-600 text-white p-6 shadow-md">
              <h2 className="text-xl font-semibold">Disbursed This Week</h2>
              <p className="mt-2 text-3xl font-bold">KES 2,100,000</p>
              <span className="block mt-1 text-sm text-green-100">Loans sent</span>
            </div>
      
            {/* Loans Disbursed This Month */}
            <div className="rounded-xl bg-gradient-to-r from-teal-400 to-teal-600 text-white p-6 shadow-md">
              <h2 className="text-xl font-semibold">Disbursed This Month</h2>
              <p className="mt-2 text-3xl font-bold">KES 5,900,000</p>
              <span className="block mt-1 text-sm text-teal-100">Loans sent</span>
            </div>
      
            {/* Loans Repaid This Week */}
            <div className="rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white p-6 shadow-md">
              <h2 className="text-xl font-semibold">Repaid This Week</h2>
              <p className="mt-2 text-3xl font-bold">KES 1,500,000</p>
              <span className="block mt-1 text-sm text-purple-100">Collected repayments</span>
            </div>
      
            {/* Loans Repaid This Month */}
            <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 text-white p-6 shadow-md">
              <h2 className="text-xl font-semibold">Repaid This Month</h2>
              <p className="mt-2 text-3xl font-bold">KES 4,800,000</p>
              <span className="block mt-1 text-sm text-indigo-100">Collected repayments</span>
            </div>
      
            {/* Pending Approvals */}
            <div className="rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-6 shadow-md">
              <h2 className="text-xl font-semibold">Pending Approvals</h2>
              <p className="mt-2 text-3xl font-bold">32</p>
              <span className="block mt-1 text-sm text-yellow-100">Loan requests</span>
            </div>
          </div>
      
          {/* Loan Performance Summary */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Loan Performance Summary</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              An overview of repayment trends, delinquencies, and monthly disbursements.
            </p>
      
            {/* Placeholder for Chart or Graph */}
            <div className="mt-6 h-64 w-full rounded-lg bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
              📊 Loan trend chart will be displayed here (Coming soon)
            </div>
          </div>
        </div>
      </AppLayout>
      
    );
}
