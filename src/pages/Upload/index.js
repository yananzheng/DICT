
import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload, Modal, Radio, Space, } from 'antd';
import './index.css'

const XLSX = require('xlsx');
const { Dragger } = Upload;

export default function UploadFile(props) {

    const {
        setData,
        setCurrent,
        current
    } = props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [optionList, setOptionList] = useState([]);
    const [value, setValue] = useState("");
    const [workbook, setWorkbook] = useState(null);

    function getDate(date) {
        if (!date) return "无";
        if (!isNaN(Number(date))) {
            const jsDate = new Date((date - 1) * 24 * 60 * 60 * 1000);
            return date ? jsDate.getFullYear() - 70 + "-" + String(jsDate.getMonth() + 1).padStart(2, '0') + "-" + String(jsDate.getDate()).padStart(2, '0') : "无";
        } else {
            return date;
        }
    }

    const draggerProps = {
        maxCount: 1,
        accept: ".xlsx",
        multiple: false,
        onChange(info) {
            const reader = new FileReader();
            reader.onload = function (e) {
                var data = new Uint8Array(e.target.result);
                var workbook = XLSX.read(data, {type: 'array'});
                console.log(workbook);
                setIsModalOpen(true);
                setOptionList(workbook.SheetNames);
                setWorkbook(workbook);
            };
            reader.readAsArrayBuffer(info.file.originFileObj);
        },
    };

    function onChange(e) {
        setValue(e.target.value);
    }

    function handleOk() {
        const table = workbook.Sheets[value];
        const tableKeys = Object.keys(table).filter((key) => key.indexOf("!") === -1);
        const columns = tableKeys.reduce((arr, item) => {
            const matches = item.match(/([a-zA-Z]+)([0-9]+)/);
            if (matches[2] === '1') return arr.concat([matches[1]]);
            else return arr;
        }, []);
        const refValue = table['!ref']; // 获取工作表的 !ref 值
        const range = XLSX.utils.decode_range(refValue);
        const rowCount = (range?.e?.r || 0) - (range?.s?.r || 0) + 2;
        let realNum = 0;
        for (let i = 0; i < rowCount; i ++) {
            const cellAddress = XLSX.utils.encode_cell({ r: i, c: 1 });
            const cellValue = table[cellAddress];
            if (cellValue !== undefined) {
                realNum ++;
            } else {
                break;
            }
        }
        const jsonData = XLSX.utils.sheet_to_json(table);
        console.log(jsonData);
        console.log(table);

        const names = ["项目名称", "录入进度", "ICT编号", "建设方式", "项目分类", "交接前后", "招标方式", "中标金额(元)", "中标日期", "要求终验时间", "计划终验时间", "业主单位、联系人", "下家单位、联系人及联系方式", "目前状态", "解决方案经理", "售中交付经理"];
        const columnNames = names.reduce((arr, item) => {
            console.log(item);
            for (let i = 0; i < columns.length; i ++) {
                console.log(columns[i] + "1", table[columns[i] + "1"].h);
                if (table[columns[i] + "1"].h === item) {
                    return arr.concat([columns[i]]);
                }
            }
            return arr.concat(["None"]);
        }, [])
        if (realNum <= 2) message.error("文件不包含有效数据！");
        else {
            let arr = new Array(realNum + 1);
            // const columns = ["B", "J", "C", "F", "G", "H", "K", "M", "L", "N", "O", "P", "Q", "I", "D", "E"];
            for (let i = 0; i < realNum + 1; i ++) {
                arr[i] = new Array(columnNames.length);
                for (let j = 0; j < columnNames.length; j ++) {
                    arr[i][j] = table[columnNames[j]+i]?.v || "";
                    if (j === 8 || j === 9 || j === 10) arr[i][j] = getDate(arr[i][j]);
                }
            }
            setData(arr);
            setCurrent("show");
        }
        setIsModalOpen(false);
    }

    function handleCancel() {
        console.log("canceled");
        setIsModalOpen(false);
    }

    return (
        <div className="upload-main" style={{ display: current === "upload" ? "block" : "none" }}>
            <div className="title">DICT项目信息可视化平台</div>
            <div className='dragger'>
                <Modal title="请选择工作表" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <Radio.Group onChange={onChange} value={value} >
                        <Space direction="vertical">
                            {optionList.map(item => {
                                return (
                                    <Radio value={item} key={item}>{item}</Radio>
                                )
                            })}
                        </Space>
                    </Radio.Group>
                </Modal>
                <Dragger {...draggerProps} 
                    style={{ width: '90vw', marginLeft: '5vw'}}
                >
                    <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">点击或将文件拖拽到此处</p>
                    <p className="ant-upload-hint">
                    仅支持excel文件！
                    </p>
                </Dragger>
            </div>
        </div>
    )
}
