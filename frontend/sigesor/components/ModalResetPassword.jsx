import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ModalResetPassword = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  userDni 
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(userDni);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />
          <h3 className="text-lg font-semibold text-white">
            Confirmación
          </h3>
        </div>
        
        <p className="text-white mb-6">
          ¿Está seguro de resetear la contraseña? Se usará el DNI como nueva clave.
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white border border-gray-300 rounded hover:bg-slate-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
          >
            Resetear Contraseña
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalResetPassword;