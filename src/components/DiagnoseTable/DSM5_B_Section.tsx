import { useState } from "react";
import { Button, Card, CardBody, Collapse, ListGroup, ListGroupItem } from "reactstrap";

const pharmacon_list = [
  {
    name: "베타차단제(Beta Blockers)",
    use: "고혈압, 부정맥, 협심증 치료에 사용"
  },
  {
    name: "클로니딘(Clonidine)",
    use: "주의력결핍 과잉행동장애(ADHD)"
  },
  {
    name: "메틸도파(Methyldopa)",
    use: "임신 중 고혈압"
  },
  {
    name: "프로카이네마이드(Procainemide)",
    use: "심방 및 심실 부정맥 치료"
  },
  {
    name: "바리투레이트(Barbiturate)",
    use: "불면증, 불안, 발작 조절에 사용"
  },
  {
    name: "페니토인(Phenytoin)",
    use: "간질(뇌전증) 치료에 사용되는 항경련제"
  },
  {
    name: "아나볼릭 스테로이드(Anabolic Steroids)",
    use: "근육 질량 증가, 골다공증 치료, 일부 호르몬 결핍 상태에서 사용"
  },
  {
    name: "코르티코스테로이드(Corticosteroids)",
    use: "염증 질환, 자가면역 질환, 알레르기 반응 치료에 광범위하게 사용"
  }
];

const diseaseList = [
  {
    type: "신경계 질환",
    name: "치매(특히 초기 단계)"
  },
  {
    type: "신경계 질환",
    name: "파킨슨병"
  },
  {
    type: "신경계 질환",
    name: "측두엽 발작(초점 발작)"
  },
  {
    type: "신경계 질환",
    name: "뇌졸중"
  },
  {
    type: "내분비계 질환",
    name: "갑상선 기능 이상(갑상선기능저하증 또는 갑상선기능항진증)"
  },
  {
    type: "내분비계 질환",
    name: "부갑상샘기능항진증"
  },
  {
    type: "내분비계 질환",
    name: "뇌하수체기능저하"
  },
  {
    type: "내분비계 질환",
    name: "생식선저하증(낮은 테스토스테론 수치)"
  },
  {
    type: "자가면역 질환",
    name: "전신성 홍반 루푸스(루푸스)"
  },
  {
    type: "심혈관계 질환",
    name: "심장마비"
  },
  {
    type: "심혈관계 질환",
    name: "심부전"
  },
  {
    type: "심혈관계 질환",
    name: "고혈압"
  },
  {
    type: "기타 질환",
    name: "암(특히 전이성 암)"
  },
  {
    type: "기타 질환",
    name: "AIDS (HIV 감염으로 인한)"
  },
  {
    type: "기타 질환",
    name: "당뇨병"
  }
];

export default function DSM5_B_Section()
{
    const [isOpenPharmacon, setIsOpenpharmacon] = useState(false);

    const toggleisOpenPharmacon = () => setIsOpenpharmacon(!isOpenPharmacon);

    const [isOpenDisease, setIsOpenDisease] = useState(false);

    const toggleisOpenDisease = () => setIsOpenDisease(!isOpenDisease);
    return(
        <>
    <Button  onClick={toggleisOpenPharmacon} style={{ marginBottom: '1rem' }}>
      우울증 유발 약물
    </Button>
    <Collapse isOpen={isOpenPharmacon}>
      <Card>
        <CardBody>
        <ListGroup>
          {
            pharmacon_list.map((pharmacon)=>(
              <>
               <ListGroupItem
      action
      active
      href="#"
      tag="a"
    >
      {`${pharmacon.name}: ${pharmacon.use}`}
    </ListGroupItem>
              </>
            ))
          }
          </ListGroup>
      </CardBody>
      </Card>
    </Collapse>

    <Button onClick={toggleisOpenDisease} style={{ marginBottom: '1rem' }}>
    우울증 유발 질병
    </Button>
    <Collapse isOpen={isOpenDisease}>
      <Card>
        <CardBody>
        {
            diseaseList.map((pharmacon)=>(
              <>
               <ListGroupItem
      action
      active
      href="#"
      tag="a"
    >
      {`${pharmacon.type}: ${pharmacon.name}`}
    </ListGroupItem>
              </>
            ))
          }
        </CardBody>
      </Card>
    </Collapse>
    </>
)

}