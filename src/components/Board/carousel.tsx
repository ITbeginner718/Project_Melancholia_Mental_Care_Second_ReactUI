import React from 'react';
import { UncontrolledCarousel } from 'reactstrap';

export interface Photo {
    photo: string;
  }


export default function ImageCarousel({photo}:Photo)
{
    
    // const items = [
    //     {
    //       src:photo, 
    //       altText: 'Slide 1',
    //       caption: 'Slide 1',
    //       header: 'Slide 1 Header'
    //     },
    //   ];

      const items = [
        {
          src:photo, 
        },
      ];

    return(
<UncontrolledCarousel items={items} />
    )
};