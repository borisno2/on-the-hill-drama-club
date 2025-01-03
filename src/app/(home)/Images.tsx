import { StaticImageData } from 'next/image'
import DramaClubImage1 from 'images/photos/drama_club_image-1.jpg'
import DramaClubImage2 from 'images/photos/drama_club_image-2.jpg'
import DramaClubImage3 from 'images/photos/drama_club_image-3.jpg'
import DramaClubImage4 from 'images/photos/drama_club_image-4.jpg'
import DramaClubImage5 from 'images/photos/drama_club_image-5.jpg'
import DramaTeensImage1 from 'images/photos/drama_teens_image-1.jpg'
import DramaTeensImage2 from 'images/photos/drama_teens_image-2.jpg'
import DramaTeensImage3 from 'images/photos/drama_teens_image-3.jpg'
import DramaTeensImage4 from 'images/photos/drama_teens_image-4.jpg'
import DramaTeensImage5 from 'images/photos/drama_teens_image-5.jpg'
import AboutUsImage1 from 'images/photos/oth-logo.png'
import HomePageImage1 from 'images/photos/home_page_image-1.jpg'
import HomePageImage2 from 'images/photos/home_page_image-2.jpg'
import HomePageImage3 from 'images/photos/home_page_image-3.jpg'
import HomePageImage4 from 'images/photos/home_page_image-4.jpg'
import HomePageImage5 from 'images/photos/home_page_image-5.jpg'
import TheatreMakingImage1 from 'images/photos/theatre_making_image-1.jpg'
import TheatreMakingImage2 from 'images/photos/theatre_making_image-2.jpg'
import TheatreMakingImage3 from 'images/photos/theatre_making_image-3.jpg'
import TheatreMakingImage4 from 'images/photos/theatre_making_image-4.jpg'
import TheatreMakingImage5 from 'images/photos/theatre_making_image-5.jpg'

import Photos from 'components/Photos'

export default function Images({ slug }: { slug?: string }) {
  let images: StaticImageData[]
  switch (slug) {
    case 'about':
      images = [AboutUsImage1]
      break
    case 'theatre-making-workshops':
      images = [
        TheatreMakingImage1,
        TheatreMakingImage2,
        TheatreMakingImage3,
        TheatreMakingImage4,
        TheatreMakingImage5,
      ]
      break
    case 'home':
      images = [
        HomePageImage1,
        HomePageImage2,
        HomePageImage3,
        HomePageImage4,
        HomePageImage5,
      ]
      break
    case 'drama-club':
      images = [
        DramaClubImage1,
        DramaClubImage2,
        DramaClubImage3,
        DramaClubImage4,
        DramaClubImage5,
      ]
      break
    case 'drama-teens':
      images = [
        DramaTeensImage1,
        DramaTeensImage2,
        DramaTeensImage3,
        DramaTeensImage4,
        DramaTeensImage5,
      ]
      break
    default:
      images = [
        HomePageImage1,
        HomePageImage2,
        HomePageImage3,
        HomePageImage4,
        HomePageImage5,
      ]
  }

  return <Photos images={images} />
}
