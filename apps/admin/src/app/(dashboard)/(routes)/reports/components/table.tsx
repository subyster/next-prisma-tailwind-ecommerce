'use client'

import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { useParams, useRouter } from 'next/navigation'

interface Order {
   id: string
   date: string // ISO date string
   total: number
   customer: string
}

export const ordersSummaryColumns: ColumnDef<Order>[] = [
   {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => <div>{row.getValue('date')}</div>,
   },
   {
      accessorKey: 'total',
      header: 'Total Amount',
      cell: ({ row }) => (
         <div>${(row.getValue('total') as number).toFixed(2)}</div>
      ),
   },
   {
      accessorKey: 'customer',
      header: 'Customer',
      cell: ({ row }) => <div>{row.getValue('customer')}</div>,
   },
]

interface LastOrdersProps {
   data: Order[]
}

export const LastOrders: React.FC<LastOrdersProps> = ({ data }) => {
   const params = useParams()
   const router = useRouter()

   return (
      <div className="my-6 block space-y-4">
         <div>
            <h2 className="text-lg font-semibold">Last Orders</h2>
            <p className="text-sm text-muted-foreground">
               Overview of recent orders placed in the store.
            </p>
         </div>
         <DataTable
            searchKey="customerName"
            columns={ordersSummaryColumns}
            data={data}
         />
      </div>
   )
}

type TopSellingProduct = {
   productId: string
   productName: string
   totalSold: number
}

export const topSellingProductsColumns: ColumnDef<TopSellingProduct>[] = [
   {
      accessorKey: 'productName',
      header: 'Product',
      cell: ({ row }) => <div>{row.getValue('productName')}</div>,
   },
   {
      accessorKey: 'totalSold',
      header: 'Total Sold',
      cell: ({ row }) => <div>{row.getValue('totalSold')}</div>,
   },
]

interface TopSellingProductsProps {
   data: TopSellingProduct[]
}

export const TopSellingProducts: React.FC<TopSellingProductsProps> = ({
   data,
}) => {
   const params = useParams()
   const router = useRouter()

   return (
      <div className="my-6 block space-y-4">
         <div>
            <h2 className="text-lg font-semibold">Top Selling Products</h2>
            <p className="text-sm text-muted-foreground">
               Overview of the best-selling products in the store.
            </p>
         </div>
         <DataTable
            searchKey="productName"
            columns={topSellingProductsColumns}
            data={data}
         />
      </div>
   )
}
