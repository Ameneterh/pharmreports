import { motion } from "framer-motion";
import principal from "../../assets/principal_image.jpg";

export default function PrincipalAddressComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col lg:flex-row gap-2 lg:gap-16 min-w-full p-4 lg:py-20 lg:px-20 text-white border-t-2 border-white"
    >
      <img src={principal} alt="Principal" className="rounded-3xl" />
      <div className="flex flex-col gap-2 font-light">
        <h1 className="text-xl lg:text-3xl font-extrabold text-yellow-600">
          Principal's Message
        </h1>

        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum
          veniam dolor rem aspernatur sed veritatis, perferendis impedit
          consectetur molestias assumenda quos, esse commodi repudiandae sint
          inventore in voluptatibus ratione animi! Lorem ipsum dolor sit, amet
          consectetur adipisicing elit. Laborum veniam dolor rem aspernatur sed
          veritatis, perferendis impedit consectetur molestias assumenda quos,
          esse commodi repudiandae sint inventore in voluptatibus ratione animi!
        </p>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum
          veniam dolor rem aspernatur sed veritatis, perferendis impedit
          consectetur molestias assumenda quos, esse commodi repudiandae sint
          inventore in voluptatibus ratione animi! Lorem ipsum dolor sit, amet
          consectetur adipisicing elit. Laborum veniam dolor rem aspernatur sed
          veritatis, perferendis impedit consectetur molestias assumenda quos,
          esse commodi repudiandae sint inventore in voluptatibus ratione animi!
        </p>
        <motion.div
          className="max-w-fit mt-5 py-2 px-4 bg-gradient-to-r from-green-800 to-emerald-900 rounded-lg hover:from-green-600 hover:to-emerald-700 text-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:ring-offset-1 focus:ring-offset-gray-900 transition duration-200 cursor-pointer flex items-center justify-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Read More ...
        </motion.div>
      </div>
    </motion.div>
  );
}
