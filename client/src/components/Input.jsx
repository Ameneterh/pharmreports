import { Eye } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";

export const PhoneField = ({ phoneNumber, setUserPhone, label, color }) => {
  return (
    <div className="flex flex-col relative w-full mt-1 pt-3 rounded px-2">
      <p
        className={`text-sm absolute -top-2 left-2 px-1 z-50 bg-white ${color && "text-red-600"}`}
      >
        {label}
      </p>
      <div className="relative w-full mt-1">
        <PhoneInput
          international
          defaultCountry="NG"
          value={phoneNumber}
          onChange={setUserPhone}
          placeholder="Enter phone number"
          className="border-none outline-none"
        />
      </div>
    </div>
  );
};

export const Input = ({ icon: Icon, label, color, ...props }) => {
  return (
    <div className="flex flex-col relative w-full">
      <p
        className={`text-sm absolute -top-3 left-2 px-1 z-50 bg-white ${color && "text-red-600"}`}
      >
        {label}
      </p>
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Icon className="size-4 text-green-500" />
        </div>
        <input
          {...props}
          className="w-full pl-10 pr-3 py-2 bg-white rounded-lg text-green-800 placeholder-green-800 transition duration-200 font-normal text-sm"
        />
      </div>
    </div>
  );
};

export const PasswordInput = ({ icon: Icon, ...props }) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="size-4 text-green-500" />
      </div>
      <input
        {...props}
        className="w-full pl-10 pr-3 py-3 bg-white rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500 text-green-800 placeholder-green-800 transition duration-200 font-normal text-sm"
      />
      <div className="absolute right-2 items-center cursor-pointer inset-y-0">
        <Eye />
      </div>
    </div>
  );
};

export const InvInput = ({ icon: Icon, label, color, ...props }) => {
  return (
    <div className="flex flex-col relative w-full">
      <p
        className={`text-sm absolute -top-1 left-2 px-1 z-50 bg-white ${color && "text-red-600"}`}
      >
        {label}
      </p>
      <div className="relative w-full mt-2">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Icon className="size-4 text-green-500" />
        </div>
        <input
          {...props}
          className="w-full pl-10 pr-3 py-2 bg-white bg-opacity-50 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500 text-gray-600 placeholder-gray-400 transition duration-200 text-sm"
        />
      </div>
    </div>
  );
};

// orderlist text area
import { useState } from "react";

function OrderedTextarea({ value, formData, fieldName, setFormData }) {
  const [text, setText] = useState("1. ");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const lines = text.split("\n");
      const lastLine = lines[lines.length - 1];

      const match = lastLine.match(/^(\d+)\./);

      if (match) {
        const nextNumber = Number(match[1]) + 1;

        setText(text + `\n${nextNumber}. `);
      } else {
        setText(text + "\n1. ");
      }
    }
  };

  return (
    <textarea
      value={value}
      onChange={(e) => setFormData({ ...formData, fieldName: e.target.value })}
      onKeyDown={handleKeyDown}
      rows={8}
      className="w-full pl-3 pr-3 py-2 rounded-lg border border-gray-700 placeholder-gray-400 transition duration-200 flex-1 text-xs"
    />
  );
}

export default OrderedTextarea;
