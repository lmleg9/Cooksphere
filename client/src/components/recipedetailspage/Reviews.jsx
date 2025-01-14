import { useContext, useState } from "react";
import { Rating } from "../Rating";
import { AuthContext } from "../../App";
import { rateAndReview } from "../../ApiClient";
import { useParams } from "react-router";
import { Checkbox } from "../common/Checkbox";

export function Reviews ({reviews}) {
  const {recipeId} = useParams();
  const currentUser = useContext(AuthContext);

  function formatDate (timestamp) {
    const date = timestamp.split('T')[0];
    return date.split('-').reverse().join('.');
  }

  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [onlyRating, setOnlyRating] = useState(false);

  async function handleSubmit (event) {
    event.preventDefault();

    const newReview = {
      author: currentUser.firstname + ' ' + currentUser.lastname,
      message: review,
      rating: rating,
      timestamp: (new Date()).toISOString()
    };
    await rateAndReview(recipeId, newReview);
  }

  function validate() {
    if (onlyRating && rating===0) return true;
    else if(!onlyRating && (rating===0 || review.trim() === '')) return true;
    return false;
  }

  function handleChange (event) {
    const newVal = event.target.checked;
    setOnlyRating(newVal);
  }
  return (
    <>
      <div className='p-4 rounded-xl md:col-span-2 bg-brown shadow_2'>
        <h2 className='text-xl font-semibold font-roboto px-4 text-white'>Reviews</h2>
          <form className='m-4 py-2 px-20 rounded-md bg-lightbeige flex flex-col gap-2' onSubmit={handleSubmit}>
            <span>Here you can rate the recipe and give feedback to the creator and other users. You can also rate the recipe without writing a review.</span>
            <Rating rating={rating} type='rate' setRating={setRating}/>
            <Checkbox id="rating-only" value={onlyRating} text="Select to give only rating without a review" handleChange={handleChange}/>
            <textarea
              name="user-review"
              id="user-review"
              value={review}
              rows={4}
              onChange={(event) => setReview(event.target.value)}
              className={(onlyRating ? 'hidden' : 'block') + ' outline-none rounded-md px-1'}></textarea>
            <button
              type="submit"
              className='bg-orange text-white hover:bg-deeporange disabled:bg-deeporange rounded-md px-2 py-1 uppercase text-sm w-fit'
              disabled={validate()}>
                {!onlyRating ? 'Post review' : 'Rate without Review'}</button>
          </form>
          <div className="flex flex-col gap-4 p-4">
            {reviews.map((review, index) => {
             return (
              <>
                <div key={index} className='py-2 rounded-md bg-lightbeige'>
                  <div className="flex justify-between px-4">
                    <span className="font-semibold">{review.author}</span>
                    <span>{formatDate(review.timestamp)}</span>
                  </div>
                  <span className="px-8">{review.message}</span>
                </div>
              </>
            )})}
          </div>
      </div>
    </>
  )
}