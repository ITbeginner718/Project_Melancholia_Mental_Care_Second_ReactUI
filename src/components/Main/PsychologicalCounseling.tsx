import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Button, Card, CardHeader, Row,
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption,
    Badge,
} from "reactstrap";


// const items = [
//     {
//         src: 'https://dnvefa72aowie.cloudfront.net/capri/smb/202101/8e9478bb9dc1b5dfc2538ce3f958a5d3a7a2ed3d1d09aa06b6.jpeg',
//         altText: 'Slide 1',
//         caption: '마인드 카페 센터',
//         url:"https://center.mindcafe.co.kr/",
//         key: 1,
//     },
//     {
//         src: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMDAzMTBfMjcw%2FMDAxNTgzODE4MjMyNDAw.FRbDnkuetORgD5h5UWw20vZ3HDv5wfC9RipylxGmm4cg.5SVMWmtrHhGEFysH5a6tHaO_v_a7XCLnp39mcsTARLIg.JPEG.wombjob%2FKakaoTalk_20200310_141500997_13.jpg',
//         altText: 'Slide 2',
//         caption: '움 심리 상담 연구소',
//         url:"http://wombcounsel.com/web/index.php",
//         key: 2,
//     },
//     {
//         src: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjA4MTVfMjgg%2FMDAxNjYwNTAxNzA1OTU1.kriueWA9usu9o_Y85-xbCF7_x-6tqSDSXXj5VZw7hd4g.5jC5iVOihfrJFI-MRQqZm1s2xVg3BG8FS4CGJYFA_t8g.JPEG.nnninano%2FDSC02122.jpg',
//         altText: 'Slide 3',
//         caption: '헬로스마일',
//         url:"http://www.hellosmile.kr/",
//         key: 3,
//     },
//     {
//         src: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzEyMDNfMjY2%2FMDAxNzAxNTk4MDgxNzYz.0Pfj3uAQmnxh7fliCQR5Nn6DnFqRD9mg5UOESvi6Zdkg.FbWrma9MS5O8MvaEN3OSUsx6wmXRkBd_jiSMU6U92Hcg.JPEG.yeronimo87%2F%25BC%25BE%25C5%25CD2.jpg',
//         altText: 'Slide 4',
//         caption: '마이스토리',
//         url:"https://www.mystoryis.kr/",
//         key: 4,
//     },
// ];

export default function PsychologicalCounseling() {

    // const [activeIndex, setActiveIndex] = useState(0);
    // const [animating, setAnimating] = useState(false);

    // const next = () => {
    //     if (animating) return;
    //     const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    //     setActiveIndex(nextIndex);
    // };

    // const previous = () => {
    //     if (animating) return;
    //     const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    //     setActiveIndex(nextIndex);
    // };

    // const goToIndex = (newIndex: any) => {
    //     if (animating) return;
    //     setActiveIndex(newIndex);
    // };

    // const slides = items.map((item) => {
    //     return (
           
    //         <CarouselItem
    //             onExiting={() => setAnimating(true)}
    //             onExited={() => setAnimating(false)}
    //             key={item.src}
    //         >
    //              <Link to={item.url!} target="_blank">
    //             <img src={item.src} alt={item.altText} style={{ width: "100%", height: '400px', opacity: 0.7}} />
    //             <CarouselCaption
    //                 captionText={null}
    //                 captionHeader={
                        
    //                     <Badge
    //                     color="dark"
    //                     pill
    //                     style={{fontSize:'30px'}}
    //                   >
    //                     {item.caption}
    //                   </Badge>}>

    //             </CarouselCaption>
    //             </Link>
    //         </CarouselItem>
          
    //     );
    // });

    return (
        <>
            <Card className="shadow">
                <CardHeader className="border-0">
                    <Row className="align-items-center">
                        <div className="col">
                            <h3 className="mb-0">심리상담 기록</h3>
                        </div>
                        <div className="col text-right">
                            <Button
                                color="primary"
                                href="#pablo"
                                onClick={(e) => e.preventDefault()}
                                size="sm"
                            >
                                See all
                            </Button>
                        </div>
                    </Row>
                </CardHeader>

                {/* <Carousel
                    activeIndex={activeIndex}
                    next={next}
                    previous={previous}
                >
                    <CarouselIndicators
                        items={items}
                        activeIndex={activeIndex}
                        onClickHandler={goToIndex}
                    />
                    {slides}
                    <CarouselControl
                        direction="prev"
                        directionText="Previous"
                        onClickHandler={previous}
                    />
                    <CarouselControl
                        direction="next"
                        directionText="Next"
                        onClickHandler={next}
                    />
                </Carousel> */}
            </Card>
        </>

    )
}           