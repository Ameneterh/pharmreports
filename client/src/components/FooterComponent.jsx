import { Link } from "react-router-dom";
import { FaTwitter, FaFacebook, FaLinkedin } from "react-icons/fa";
import {
  MdAddCall,
  MdAlternateEmail,
  MdLocationOn,
  MdOutlineMarkEmailRead,
  MdOutlinePhoneInTalk,
  MdWhatsapp,
} from "react-icons/md";

export default function FooterComponent() {
  return (
    <footer className="py-10 px-4 bg-black flex items-center justify-center font-extralight text-white z-50 mt-8 text-center text-sm border-t border-t-slate-800 w-full pt-5">
      All Rights Reserved &copy; {new Date().getFullYear()} AMSH Dept of
      Pharmaceutical Services.
    </footer>
  );
}
