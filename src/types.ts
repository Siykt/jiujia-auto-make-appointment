export interface CityResponse {
  name: string
  value: string
}

export interface VaccineResponse {
  id: number
  name: string
  imgUrl: string
  vaccineCode: string
  vaccineName: string
  address: string
  startTime: string
  stock: 1
}

export interface VaccineDetailResponse {
  startTime: string
  vaccineName: string
  factoryName: string
  isSubscribeAll: string
  /** 疫苗限制 */
  seckillDescribtion: string
  departmentName: string
  stock: number
  depaCode: number
  birthdayEnd: string
  birthdayStart: string
  regionRequired: string
  regionRequiredName: string
  sexRequired: 2
}

export enum Regions {
  jiangsu = '32',
  zhejiang = '33',
  anhui = '34',
  fujian = '35',
}

export const regionList = [
  Regions.jiangsu,
  Regions.zhejiang,
  Regions.anhui,
  Regions.fujian,
]

export enum RegionCode {
  shanghai = '3101',
  chongqing = '5001',
  beijing = '1100',
}
