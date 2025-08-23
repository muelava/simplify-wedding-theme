import React from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ open, onClose, title, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-3 md:px-0" onClick={onClose}>
      <div data-aos="zoom-in" data-aos-duration="500" className="bg-[#fefefe] p-6 rounded-2xl shadow-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        {title && <h2 className="text-2xl font-bold mb-4 text-[#6A6357]">{title}</h2>}
        <div>{children}</div>
        {/* <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          Close
        </button> */}
      </div>
    </div>
  );
};

export default Dialog;
