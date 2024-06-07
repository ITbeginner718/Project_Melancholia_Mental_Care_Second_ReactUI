import { auth, db } from "../../firebase";
import { Bar } from "react-chartjs-2";
import { Card, CardBody, CardHeader, Row } from "reactstrap";
import { Unsubscribe, collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { set } from "firebase/database";

export default function DiagnoseChart() {

    // 사용자 정보
    const user = auth.currentUser;


    // // 진단 데이터 결과값 가져오기
    // const arr_resultScore: string[] = []
    // const arr_dignoseDate: any[] = []
    // // 진단 데이터 날짜 가져오기 

    // const arr1_resultScore: any[]=[];
    // const arr2_dignoseDate: any[]=[];  


    // 차트 
    const [chartExample2, setChartExample2] = useState<any>(null);

    const [resultScore, setResultScore] = useState<any>([]);   
    const [diagnoseDate, setDiagnoseDate] = useState<any>([]);
    
    
    useEffect(() => {
        // useEffect는 1번만 실행(사실 1번만 실행되게 했어도 2번 실행)
        let unsubscribe: Unsubscribe | null = null;

        // 사용자가 작성한 tweet만 보여주기
        const fetchDiagnoses = async () => {
            const diagnoseQuery = query(
                collection(db, "diagnoses"),
                where("userID", "==", user?.uid),
                orderBy("Credential", "desc"),
                limit(6),
            );

            // 스냅샷
            unsubscribe = await onSnapshot(diagnoseQuery, (snapshot) => {
                const resultScores:any[]=[];
                const diagnoseDates:any[]=[]; 

                snapshot.docs.map((document) => {
                    const { resultScore, diagnoseDate } = document.data();

                    const resultScore_int = parseInt(resultScore);      

                    resultScores.push(resultScore_int); 
                    diagnoseDates.push(diagnoseDate);   
                });
                setResultScore(resultScores);
                setDiagnoseDate(diagnoseDates);    

            });
        }

        // 함수 호출
        fetchDiagnoses();

        return () => {
            unsubscribe && unsubscribe();
            console.log("diagnoseUnsubscribe called");
        }

    }, []);

    useEffect(() => {
        if (resultScore) {
            const example = {
                options: {
                    scales: {
                        yAxes: [
                            {
                                ticks: {
                                    callback: function (value: any) {
                                        if (!(value % 5)) {
                                            return value;
                                        }
                                    },
                                },
                            },
                        ],
                    },
                    tooltips: {
                        callbacks: {
                            label: function (item: any, data: any) {
                                var label = data.datasets[item.datasetIndex].label || "";
                                var yLabel = item.yLabel;
                                var content = "";
                                if (data.datasets.length > 1) {
                                    content += label;
                                }
                                content += yLabel;
                                return content;
                            },
                        },
                    },
                },
                data: {
                    labels:diagnoseDate,
                    datasets: [
                        {
                            label: "Sales",
                            data: resultScore,
                            maxBarThickness: 10,
                        },
                    ],
                },
            };
            setChartExample2(example);
        }
    }, [resultScore]);

    return (
        <>
            <Card className="shadow">
                <CardHeader className="bg-transparent">
                    <Row className="align-items-center">
                        <div className="col">
                            <h6 className="text-uppercase text-muted ls-1 mb-1">
                                Performance
                            </h6>
                            <h2 className="mb-0">Diagnose Result</h2>
                        </div>
                    </Row>
                </CardHeader>
                <CardBody>
                    {/* Chart */}
                    <div className="chart">
                        {chartExample2 && (
                            <Bar
                                data={chartExample2.data}
                                options={chartExample2.options} />
                        )}
                    </div>
                </CardBody>
            </Card>
        </>
    );
}
