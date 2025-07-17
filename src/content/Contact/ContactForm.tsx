// src/components/ContactForm.tsx
import React, { useState } from 'react';

const ContactForm: React.FC = () => {
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to a backend API
    console.log({ fullName, email, phoneNumber, message });
    alert('Message sent! (Check console for data)');
    // Reset form fields
    setFullName('');
    setEmail('');
    setPhoneNumber('');
    setMessage('');
  };

  return (
    <div className="bg-red-600 p-8 rounded-lg shadow-md text-white">
      <h2 className="text-2xl font-semibold mb-6 text-center">Send us a Message</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-1">FullName:</label>
          <input
            type="text"
            id="fullName"
            className="w-full p-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email:</label>
          <input
            type="email"
            id="email"
            className="w-full p-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">Phone Number:</label>
          <input
            type="tel" // Use type="tel" for phone numbers
            id="phoneNumber"
            className="w-full p-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">message:</label>
          <textarea
            id="message"
            rows={5}
            className="w-full p-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-white text-red-600 font-bold py-3 rounded-md hover:bg-gray-200 transition-colors"
        >
          send
        </button>
      </form>
    </div>
  );
};

export default ContactForm;