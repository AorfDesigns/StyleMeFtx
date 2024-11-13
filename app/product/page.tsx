import React from 'react'
import Product from './_components/Product'
import AppLayout from '../Applayout'
import ManufacturerProduct from './_components/Product'

const page = () => {
  return (
    <AppLayout>
        <ManufacturerProduct/>
    </AppLayout>
  )
}

export default page