import { useEffect, useState } from "react";
import * as echarts from 'echarts';
import { Progress, Select, ConfigProvider } from 'antd';

import "./index.css"

export default function Show(props){

    const {
        data = [],
        current,
    } = props;

    const [project, setProject] = useState(new Array(14));
    const [options, setOptions] = useState(new Array(Math.max(data.length - 2, 0)));
    const [days, setDays] = useState([]);
    const [num, setNum] = useState(0);
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");

    const handleChange = (value) => {
        if(value !== -1) setProject(data[value]);
        const day1 = Math.floor((new Date() - new Date(data[value][8])) / (1000 * 60 * 60 * 24));
        const day2 = Math.floor((new Date(data[value][10]) - new Date()) / (1000 * 60 * 60 * 24));
        setDays([day1, day2]);
    };

    let option = {
        tooltip: {
          formatter: "{b} : {c} ({d}%)",
      },
        legend: {
            top: '8%',
            left: 'center',
            textStyle: {
                color: "#FFFFFF"
            }
        },
        series: [
            {
                name: '交接前后',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center',
                },
                emphasis: {
                    label: {
                      show: true,
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: '#FFFFFF'
                    }
                },
                labelLine: {
                    show: false
                }
            }
        ],
    };
    
    let axisOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ['目前状态']
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '数量',
            min: 0,
            max: 20,
            interval: 5,
            axisLabel: {
              formatter: '{value}'
            }
          },
        ],
        series: [
          {
            name: '目前状态',
            type: 'bar',
            yAxisIndex: 0,
            tooltip: {
              valueFormatter: function (value) {
                return value;
              }
            },
            data: [
              2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
            ]
          },
          {
            name: '目前状态',
            type: 'line',
            yAxisIndex: 0,
            tooltip: {
              valueFormatter: function (value) {
                return value;
              }
            },
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
          }
        ]
      };

    useEffect(() => {
        var transferDom = document.getElementById('transfer');
        var transferChart = echarts.init(transferDom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        const transferOption = JSON.parse(JSON.stringify(option));
        let transferArr = [{value: 0, name: "存量"}, {value: 0, name: "新增"}];
        for (let i = 2; i < data.length; i ++) {
            if (data[i][5] === "存量") transferArr[0].value += 1;
            else transferArr[1].value += 1;
        }
        transferOption.series[0].data = transferArr;
        transferOption.series[0].name = "交接前后";
        transferOption.legend.top = '14%'
        transferChart.setOption(transferOption);

        var constructDom = document.getElementById('construct');
        var constructChart = echarts.init(constructDom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        const constructOption = JSON.parse(JSON.stringify(option));
        let constructArr = [{value: 0, name: "集成公司"}, {value: 0, name: "铁通"}, {value: 0, name: "自建+集成公司"}];
        for (let i = 2; i < data.length; i ++) {
            if (data[i][3] === "集成公司") constructArr[0].value += 1;
            else if (data[i][3] === "铁通") constructArr[1].value += 1;
            else constructArr[2].value += 1;
        }
        constructOption.series[0].data = constructArr;
        constructOption.series[0].name = "建设前后";
        constructChart.setOption(constructOption);

        var biddingtDom = document.getElementById('bidding');
        var biddingChart = echarts.init(biddingtDom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        const biddingOption = JSON.parse(JSON.stringify(option));
        let biddingArr = [{value: 0, name: "公开招标"}, {value: 0, name: "直接签约"}];
        for (let i = 2; i < data.length; i ++) {
            if (data[i][6] === "公开招标") biddingArr[0].value += 1;
            else if (data[i][6] === "直接签约") biddingArr[1].value += 1;
        }
        biddingOption.series[0].data = biddingArr;
        biddingOption.series[0].name = "招标方式";
        biddingChart.setOption(biddingOption);

        var stateDom = document.getElementById('state');
        var stateChart = echarts.init(stateDom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        const stateOption = JSON.parse(JSON.stringify(axisOption));
        console.log(data);
        const stateOrg = data.reduce((acc, cur, index) => {
            if (index < 2) return acc;
            if (acc.includes(cur[13])) return acc;
            else return acc.concat([cur[13]]);
        }, []);
        console.log(stateOrg);
        let stateArr = new Array(stateOrg.length).fill(0);
        for (let i = 2; i < data.length; i ++) {
            for (let j = 0; j < stateOrg.length; j ++) {
                if (data[i][13] === stateOrg[j]) stateArr[j] += 1;
            }
            // if (data[i][13] === "待委托") stateArr[0] += 1;
            // else if (data[i][13] === "委托在途") stateArr[1] += 1;
            // else if (data[i][13] === "在建") stateArr[2] += 1;
            // else stateArr[3] += 1;
        }
        stateOption.series[0].data = stateArr;
        stateOption.series[1].data = stateArr;
        stateOption.yAxis[0].max = Math.ceil(Math.max(...stateArr) / 5) * 5;
        stateOption.yAxis[0].interval = Math.ceil(Math.max(...stateArr) / 5);
        stateOption.xAxis[0].data = stateOrg;
        console.log(stateOption);
        stateChart.setOption(stateOption);
        if (data.length > 0) {
            const day1 = Math.floor((new Date() - new Date(data[2][8])) / (1000 * 60 * 60 * 24));
            const day2 = Math.floor((new Date(data[2][10]) - new Date()) / (1000 * 60 * 60 * 24));
            setDays([day1, day2]);
        }
    }, [JSON.stringify(data)]);

    useEffect(() => {
        const interval = setInterval(() => {
            const date = new Date();
            const year = date.getFullYear(); // 年份
            const month = date.getMonth() + 1; // 月份（注意：月份是从0开始计数的，所以要加1）
            const day = date.getDate(); // 日期
            const hours = date.getHours(); // 小时
            const minutes = date.getMinutes(); // 分钟
            const seconds = date.getSeconds(); // 秒钟
            const currentDate = year + "-" + (month.toString().length === 1 ? "0" : "") + month + "-" + (day.toString().length === 1 ? "0" : "") + day;
            const currentTime = (hours.toString().length === 1 ? "0" : "") + hours + ":" + (minutes.toString().length === 1 ? "0" : "") + minutes + ":" + (seconds.toString().length === 1 ? "0" : "") + seconds;
            setDate(currentDate);
            setTime(currentTime);
        }, 1000)

        return () => {
            clearInterval(interval);
        }
    }, [])


    useEffect(() => {
        const projects = new Array(Math.max(data.length - 2, 0));
        for (let i = 2; i < data.length; i ++) {
            projects[i - 2] = {
                value: i,
                label: data[i][0],
            }
        }
        if (projects.length > 0) setProject(data[2]);
        if (projects.length === 0) projects.push({label: "请先上传文件", value: -1});
        setOptions(projects);
        setNum(data.length - 2);
    }, [JSON.stringify(data)]);    

    return (
        <div className="main" style={{ display: current === 'show' ? "flex" : "none" }}>
            <div className="left">
                <div className="left-number">
                    <div className="left-number-title">//在建项目//</div>
                    <div className="left-number-content">{num}</div>
                    <div className="left-number-left-top-left-line"></div>
                    <div className="left-number-left-top-top-line"></div>
                    <div className="left-number-right-top-right-line"></div>
                    <div className="left-number-right-top-top-line"></div>
                    <div className="left-number-left-bottom-bottom-line"></div>
                    <div className="left-number-left-bottom-left-line"></div>
                    <div className="left-number-right-bottom-bottom-line"></div>
                    <div className="left-number-right-bottom-right-line"></div>
                </div>
                <div className="left-state">
                    <div className="left-state-title">在途项目交接状态</div>
                    <div id="transfer" className="left-state-figure"></div>
                </div>
                <div className="left-way">
                    <div className="left-way-title">在途项目建设方式</div>
                    <div id="construct" className="left-state-figure"></div>
                </div>
            </div>
            <div className="middle">
                <div className="middle-title">DICT项目信息可视化平台</div>
                <div className="middle-content">
                    <div className="middle-content-titles">
                        <div className="middle-content-titles-project">
                            <Select
                                showSearch
                                defaultValue="请先选择项目"
                                onChange={handleChange}
                                options={options}
                                value={project[0]}
                                style={{ width: '18vw'}}
                                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                />
                        </div>
                        <div className="middle-content-titles-number">
                            {project[2] || "无"}
                        </div>
                    </div>
                    <div className="middle-content-detail">
                        <div className="middle-content-progress">
                            <div className="middle-content-progress-title">录入进度</div>
                            <ConfigProvider
                                theme={{
                                    components: {
                                    Progress: {
                                        circleTextColor: "#FFFFFF",
                                        remainingColor: "#FFFFFF"
                                    },
                                    },
                                }}
                                >
                                    <Progress type="circle" percent={project[1]*100 || 0} />
                                </ConfigProvider>
                        </div>
                        <div className="middle-content-content">
                            <div><span className="middle-content-bolder">建设方式：</span>{project[3] || "无"}</div>
                            <div><span className="middle-content-bolder">项目分类：</span>{project[4] || "无"}</div>
                            <div><span className="middle-content-bolder">交接前后：</span>{project[5] || "无"}</div>
                            <div><span className="middle-content-bolder">招标方式：</span>{project[6] || "无"}</div>
                            <div><span className="middle-content-bolder">中标金额：</span>{project[7] || "无"}</div>
                            <div><span className="middle-content-bolder">中标时间：</span>{project[8] || "无"}</div>
                            <div><span className="middle-content-bolder">要求终验时间：</span>{project[9] || "无"}</div>
                            <div><span className="middle-content-bolder">计划终验时间：</span>{project[10] || "无"}</div>
                        </div>
                    </div>
                </div>
                <div className="middle-content-bottom">
                    <div className="middle-content-bottom-title">通讯录</div>
                    <div className="middle-content-bottom-block">
                        <br/>
                        <div className="middle-content-row">
                            <div style={{ marginRight: '1vw'}} className="middle-content-back middle-content-row"><span className="middle-content-bolder">解决方案经理：</span>{project[14] || "无"}</div>
                            <div className="middle-content-back middle-content-row "><span className="middle-content-bolder">售中交付经理：</span>{project[15] || "无"}</div>
                        </div>
                        <div className="middle-content-back">
                            <div><span className="middle-content-bolder">业主单位、联系人及联系方式：</span></div>
                            <div>{project[11] || "无"}</div>
                        </div>
                        <div className="middle-content-back">
                            <div><span className="middle-content-bolder">下家单位、联系人及联系方式：</span></div>
                            <div>{project[12] || "无"}</div>
                        </div>
                    </div>
                </div>
                <div className="middle-content-warning">
                    <div className="middle-content-bottom-title">提示模块</div>
                    <div className="middle-content-warning-block">
                        <br/>
                        <div className="middle-content-back middle-content-row"><span className="middle-content-bolder">目前状态：</span>{project[13] || "无"}</div>
                        <div className="middle-content-back middle-content-row">
                            <span style={{ marginRight: '1vw' }}><span className="middle-content-bolder">委托及时率提醒：</span>{(isNaN(days[0]) || project[13] !== '委托在途') ? "无" : (days[0] < 30 ? "剩" + days[0] + "天！" : <span style={{color: "red"}}>报警！</span>)}</span>
                        </div>
                        <div className="middle-content-back middle-content-row">
                            <span className="middle-content-bolder">验收时间提醒：</span>{(isNaN(days[1]) || ["已验收待转维", "已转维"].includes(project[13])) ? "无" : (days[1] < 30 ? "剩" + days[1] + "天！" : <span style={{color: "red"}}>报警！</span>)}
                        </div>
                    </div>
                </div>
            </div>
            <div className="right">
                <div className="right-date">
                    <div className="right-date-time">{time}</div>
                    <div className="right-date-date">{date}</div>
                </div>
                <div className="right-count">
                    <div className="right-count-title">直签招标项目统计</div>
                    <div id="bidding" className="left-state-figure"></div>
                </div>
                <div className="right-state">
                    <div className="right-state-title">在途项目目前状态</div>
                    <div id="state" className="right-state-figure"></div>
                </div>

            </div>
        </div>
    )
}