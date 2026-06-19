import { format } from 'date-fns'
import { APP_NAME } from '../../constants/app'

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          &copy; {format(new Date(), 'yyyy')} {APP_NAME}. All rights reserved.
        </p>
        <p>Built for resilient teams and secure workflows.</p>
      </div>
    </footer>
  )
}

export default Footer
