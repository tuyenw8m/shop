export default function Footer() {
  return (
    <footer className="bg-teal-800 text-white p-4 flex flex-col items-center justify-center">
      <div className="flex space-x-4 mb-2">
        <a href="#" className="hover:underline">About Us</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
        <a href="#" className="hover:underline">Terms of Service</a>
        <a href="#" className="hover:underline">Contact Us</a>
      </div>
      <div className="text-sm">
        © 2025 STQ Shop. All rights reserved.
      </div>
    </footer>
  );
}