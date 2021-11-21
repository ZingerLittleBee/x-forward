// import React, {useState} from "react";
// import {useRequest} from "@@/plugin-request/request";
// import {TreeSelect} from "antd";
//
// const treeDataInit = [
//   { id: '1', pId: 0, value: '1', title: '/root' },
//   { id: '2', pId: 0, value: '2', title: '/ect' },
//   { id: '3', pId: 0, value: '3', title: 'Tree Node', isLeaf: true }
// ]
//
// const DirTreeSelect: React.FC<{
//   value?: string
//   onChange?: (value: string) => void;
// }> = ({ value, onChange }) => {
//   const { run } = useRequest((params: string) => ({
//     url: `/env/dir/${params}`,
//   }), { manual: true })
//
//   const [selectValue, setSelectValue] = useState<any>(undefined)
//   const [treeData, setTreeData] = useState<any>(treeDataInit)
//
//   const onLoadData = async ({ id }: {id: any}) => {
//     const res = await run(id)
//     const newRes = res.map(r => {
//       const random = Math.random().toString(36).substring(2, 6);
//       return {
//         id: random,
//         pId: id,
//         value: random,
//         title: r,
//         isLeaf: false,
//       }
//     })
//     setTreeData([...treeData, ...newRes]);
//   }
//
//   const computedPath = (e: any) => {
//     const curTreeDate = treeData.filter(t => t.id === e)[0]
//     if (curTreeDate.pId === 0) {
//       return curTreeDate.title
//     }
//     return computedPath(curTreeDate.pId) + '/' + curTreeDate.title
//   }
//
//   const onSelectChange = (e) => {
//     setSelectValue(e);
//     if (onChange) {
//       onChange(computedPath(e))
//     }
//   };
//
//
//   return (
//     <TreeSelect
//       treeDataSimpleMode
//       style={{ width: '100%' }}
//       value={selectValue}
//       dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
//       dropdownMatchSelectWidth={false}
//       placeholder="Please select"
//       onChange={onSelectChange}
//       loadData={onLoadData}
//       treeData={treeData}
//     />
//   )
//
//
// }
//
// export default DirTreeSelect
