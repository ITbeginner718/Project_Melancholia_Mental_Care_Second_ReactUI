import { Link } from "react-router-dom";
import { Button, Card, CardHeader, Row, Table } from "reactstrap";

const articleBlogs = [
  {
    src: 'https://m.post.naver.com/viewer/postView.naver?volumeNo=36349264&memberNo=2170614',
    caption: '나도 내 감정을 모르겠다면',
    category: 'blog',
  },
  {
    src: 'https://m.health.chosun.com/svc/news_view.html?contid=2018022002428',
    caption: '우울증 환자 80%는 혼자 해결하려다 병키워… 우울증은 치료하면 좋아지는 병입니다',
    category: 'article',
  },
  {
    src: 'https://youtu.be/v75sWnEU-yk?feature=shared',
    caption: '남을 사랑하는 것보다 중요한 나를 사랑하기 알고리즘이 만들어주는 세상에서 흐릿해지는 나',
    category: 'youtube',
  },

];

export default function ArticleBlog() {
  return (
    <Card className="shadow">
      <CardHeader className="border-0">
        <Row className="align-items-center">
          <div className="col">
            <h3 className="mb-0">Social traffic</h3>
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
      <Table className="align-items-center table-flush" responsive>

        <thead className="thead-light">
          <tr>
            <th scope="col">title</th>
            <th scope="col">category</th>
            <th scope="col" />
          </tr>
        </thead>

        <tbody>
          {articleBlogs.map((aricleBlog, index) => (
            <>
              <tr key={index}>
                <Link to={aricleBlog.src} target="_blank">
                  <td>{aricleBlog.caption.length > 20 ? `${aricleBlog.caption.substring(0, 20)}...` : aricleBlog.caption}</td>
                </Link>
                <td>{aricleBlog.category}</td>
              </tr>
            </>
          ))}
        </tbody>

      </Table>
    </Card>
  )
}