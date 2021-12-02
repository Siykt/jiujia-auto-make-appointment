import axios from 'axios'
import config from './config'
import {
  CityResponse,
  regionList,
  VaccineDetailResponse,
  VaccineResponse,
} from './types'

type Vaccine = VaccineResponse & { cityInfo: CityResponse }

axios.defaults.baseURL = 'https://miaomiao.scmttec.com'
axios.defaults.headers['tk'] = config.tk
axios.defaults.headers['Cookies'] = config.tk
axios.defaults.headers['User-Agent'] = config['User-Agent']

axios.interceptors.response.use(
  (response) => {
    const { code, ok } = response.data
    if (ok && code === '0000') {
      return response.data
    }
    return Promise.reject(new Error(JSON.stringify(response.data)))
  },
  (error) => {
    const { response } = error

    if (response.status === 503) {
      console.log(response.data.error_msg)
    }
  },
)

async function getVaccineList(regionCode = '3301') {
  const url = `/seckill/seckill/list.do?offset=0&limit=10&regionCode=${regionCode}`
  const { data } = await axios.get<VaccineResponse[]>(url)

  if (data && data.length) {
    return data
  }
  return false
}

async function getCity(parentCode = '33') {
  const url = `/base/region/childRegions.do?parentCode=${parentCode}`
  const { data } = await axios.get<CityResponse[]>(url)
  const vaccineList: Vaccine[] = []

  try {
    // await Promise.all(
    //   data.map(async ({ value, name }) => {
    //     console.log('正在获取城市 ->', name)
    //     try {
    //       if (await getSeckillStatus(value)) {
    //         console.log('已有城市 ->', name)
    //       } else {
    //         console.log(`无疫苗城市: ${name}`)
    //       }
    //     } catch (error) {
    //       console.log('name ->', name)
    //       console.log('value ->', value)
    //     }
    //   }),
    // )

    for (const { value, name } of data) {
      const res = await getVaccineList(value)
      if (res) {
        console.log('已有城市 ->', name)
        vaccineList.push(
          ...res.map((data) => ({ ...data, cityInfo: { name, value } })),
        )
      } else {
        console.log(`无疫苗城市: ${name}`)
      }
    }
  } catch (error) {
    console.log('error ->', error)
  }

  return vaccineList
}

async function getVaccineDetail(id = 1262) {
  const url = `/seckill/seckill/detail.do?id=${id}`
  const { data } = await axios.get<VaccineDetailResponse>(url)
  console.log('疫苗限制 ->', data.seckillDescribtion)
  console.log('疫苗数量 ->', data.stock)
  console.log('秒杀开始时间 ->', data.startTime)
  console.log('出生最大日期 ->', data.birthdayStart)
  console.log('出生最小日期 ->', data.birthdayEnd)

  return data
}

async function main() {
  const allVaccineList: Vaccine[] = []
  for (const region of regionList) {
    try {
      allVaccineList.push(...(await getCity(region)))
    } catch (error) {
      console.log('main error ->', error)
    }
  }

  for (const vaccine of allVaccineList) {
    try {
      await getVaccineDetail(vaccine.id)
    } catch (error) {
      console.log('main error ->', error)
    }
  }
  // console.log('allVaccineList ->', allVaccineList)
}

main()
