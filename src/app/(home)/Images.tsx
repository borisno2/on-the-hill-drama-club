import { StaticImageData } from 'next/image'
import MusicImage1 from 'images/photos/music_image-1.jpg'
import MusicImage2 from 'images/photos/music_image-2.jpg'
import MusicImage3 from 'images/photos/music_image-3.jpg'
import MusicImage4 from 'images/photos/music_image-4.jpg'
import MusicImage5 from 'images/photos/music_image-5.jpg'
import DramaClubImage1 from 'images/photos/drama_club_image-1.jpg'
import DramaClubImage2 from 'images/photos/drama_club_image-2.jpg'
import DramaClubImage3 from 'images/photos/drama_club_image-3.jpg'
import DramaClubImage4 from 'images/photos/drama_club_image-4.jpg'
import DramaClubImage5 from 'images/photos/drama_club_image-5.jpg'
import image1 from 'images/photos/image-1.jpg'
import image2 from 'images/photos/image-2.jpg'
import image3 from 'images/photos/image-3.jpg'
import image4 from 'images/photos/image-4.jpg'
import image5 from 'images/photos/image-5.jpg'
import OrchestraImage1 from 'images/photos/orchestra_image-1.jpg'
import OrchestraImage2 from 'images/photos/orchestra_image-2.jpg'
import OrchestraImage3 from 'images/photos/orchestra_image-3.jpg'
import MusicalMunchkinsImage1 from 'images/photos/child_music_image-1.jpg'
import MusicalMunchkinsImage2 from 'images/photos/child_music_image-2.jpg'
import MusicalMunchkinsImage3 from 'images/photos/child_music_image-3.jpg'
import DramaTeensImage1 from 'images/photos/drama_teens_image-1.jpg'
import DramaTeensImage2 from 'images/photos/drama_teens_image-2.jpg'
import DramaTeensImage3 from 'images/photos/drama_teens_image-3.jpg'
import DramaTeensImage4 from 'images/photos/drama_teens_image-4.jpg'
import DramaTeensImage5 from 'images/photos/drama_teens_image-5.jpg'
import MusicTheoryImage1 from 'images/photos/music_theory_image-1.jpg'

import Photos from 'components/Photos'


export default function Images({ slug }: { slug?: string }) {
  let images: StaticImageData[]
  switch (slug) {
    case 'private-music-tuition':
      images = [
        MusicImage1,
        MusicImage2,
        MusicImage3,
        MusicImage4,
        MusicImage5,
      ]
      break
    case 'drama-club':
      images = [DramaClubImage1, DramaClubImage2, DramaClubImage3, DramaClubImage4, DramaClubImage5]
      break
    case 'only-strings-orchestra':
      images = [OrchestraImage1, OrchestraImage2, OrchestraImage3]
      break
    case 'musical-munchkins':
      images = [MusicalMunchkinsImage1, MusicalMunchkinsImage2, MusicalMunchkinsImage3]
      break
    case 'drama-teens':
      images = [DramaTeensImage1, DramaTeensImage2, DramaTeensImage3, DramaTeensImage4, DramaTeensImage5]
      break
    case 'music-theory':
      images = [MusicTheoryImage1]
      break
    default:
      images = [image1, image2, image3, image4, image5]
  }

  return (
    <Photos images={images} />

  )
}
