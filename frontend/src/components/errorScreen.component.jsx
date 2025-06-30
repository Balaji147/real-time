import { FiAlertCircle } from 'react-icons/fi';

export default function ErrorMessage({ 
  title = "No Data Available", 
  message = "Please try again later or contact support.", 
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <FiAlertCircle className="mx-auto mb-4 text-red-500" size={48} />
        <h1 className="text-3xl font-extrabold text-gray-800 mb-3">{title}</h1>
        <p className="text-gray-600 mb-6">{message}</p>
      </div>
    </div>
  );
}
