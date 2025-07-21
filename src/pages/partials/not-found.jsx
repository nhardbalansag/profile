import React from 'react'

const NotFound = () => {
  return (
    <div>
        <main className="grid min-h-full px-6 py-24 bg-white place-items-center sm:py-32 lg:px-8">
          <div className="text-center">
            <p className="text-base font-semibold text-indigo-600">404</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl page_not_found_label_id">Page not found</h1>
            <p className="mt-6 text-base leading-7 text-gray-600 sorry_we_couldnt_find_label_id">Sorry, we couldn’t find the page you’re looking for.</p>
          </div>
        </main>
    </div>
  )
}

export default NotFound
