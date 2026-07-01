import { Star } from "lucide-react";

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const full = rating >= star;
        const half = rating >= star - 0.5 && rating < star;

        return (
          <div key={star} className="relative w-5 h-5">
            {/* Empty Star */}
            <Star className="w-5 h-5 text-gray-300 fill-gray-300 absolute" />

            {/* Full Star */}
            {full && (
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 absolute" />
            )}

            {/* Half Star */}
            {half && (
              <div className="overflow-hidden w-1/2 absolute">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
