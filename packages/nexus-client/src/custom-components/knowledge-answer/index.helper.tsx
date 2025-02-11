// import createAxios from "@/utils/http.ts";
//
// // 预览txt文件
// export const getTxtContent = (url: string) => {
//     const transformData = (data: any) => {
//         return new Promise((resolve) => {
//             let reader = new FileReader();
//             reader.readAsText(data, 'UTF-8');
//             reader.onload = () => {
//                 resolve(reader.result)
//             }
//         })
//     }
//     const axios = createAxios({baseURL: url});
//     return axios.get(url, {
//         responseType: "blob",
//         transformResponse: [
//             async function (data) {
//             console.log({data});
//                 return await transformData(data);
//             },
//         ],
//     }).then(res => {
//         return res;
//     })
// }
//
// export const fileViewerType = ["pdf", "csv", "xslx", "docx"]