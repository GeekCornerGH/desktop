import { createModel } from '@rematch/core'
import { ApplicationState } from '../store'
import { graphQLRequest, graphQLGetErrors, graphQLHandleError } from '../services/graphQL'

type ILicenseLookup = { id: string; services: string; evaluation: string; platform: number }

export const LicenseLookup: ILicenseLookup[] = [
  {
    id: '55d9e884-05fd-11eb-bda8-021f403e8c27',
    services: 'aws-services',
    evaluation: 'aws-evaluation',
    platform: 1185,
  },
]

type ILicensing = ILookup<any> & {
  licenses: {
    id: string
    created: Date
    updated: Date
    expiration: Date
    valid: boolean
    value: object
    plan: {
      id: string
      name: string
      description: string
      duration: string
      product: {
        id: string
        name: string
        description: string
        provider: string
      }
    }
  }[]
  limits: {
    name: string
    value: any
    actual: any
  }[]
}

const state: ILicensing = {
  licenses: [],
  limits: [],
}

export default createModel({
  state,
  effects: (dispatch: any) => ({
    async fetch() {
      try {
        const result = await graphQLRequest(
          ` {
              login {
                licenses {
                  id
                  created
                  updated
                  expiration
                  valid
                  plan {
                    id
                    name
                    description
                    duration
                    product {
                      id
                      name
                      description
                      provider
                    }
                  }
                }
                limits {
                  name
                  value
                  actual
                }
              }
            }`
        )
        graphQLGetErrors(result)
        dispatch.licensing.parse(result?.data?.data?.login)
      } catch (error) {
        await graphQLHandleError(error)
      }
    },
    async parse(data: any) {
      if (!data) return
      // dispatch.licensing.set({
      //   licenses: data.licenses.map((l: any) => ({
      //     ...l,
      //     created: new Date(l.created),
      //     updated: new Date(l.updated),
      //     expiration: new Date(l.expiration),
      //   })),
      //   limits: data.limits,
      // })
      dispatch.licensing.set({
        licenses: [
          {
            id: 'e46e5c55-7d12-46c5-aee3-493e29e604db',
            created: new Date('2020-10-17T01:03:47.976Z'),
            updated: new Date('2020-10-17T01:03:47.976Z'),
            expiration: new Date('2020-10-16T01:03:48.000Z'),
            valid: true,
            plan: {
              id: '649b2e68-05fd-11eb-bda8-021f403e8c27',
              name: 'TRIAL',
              description: 'trial',
              duration: 'P30D',
              product: {
                id: '55d9e884-05fd-11eb-bda8-021f403e8c27',
                name: 'remote.it for AWS',
                description: 'remote.it for AWS',
                provider: 'AWS',
              },
            },
          },
        ],
        limits: [
          {
            name: 'aws-evaluation',
            value: 'P7D',
            actual: null,
          },
          {
            name: 'aws-services',
            value: 2,
            actual: 6,
          },
        ],
      })
    },
  }),
  reducers: {
    set(state: ILicensing, params: ILookup<any>) {
      Object.keys(params).forEach(key => (state[key] = params[key]))
    },
  },
})

export function getLicense(state: ApplicationState, device?: IDevice) {
  const lookup = LicenseLookup.find(l => l.platform === device?.targetPlatform)
  const evaluationLimit = state.licensing.limits.find(l => l.name === lookup?.evaluation)
  const evaluationDays = evaluationLimit?.value.replace(/\D/g, '')
  return {
    license: state.licensing.licenses.find(l => l.plan.product.id === lookup?.id),
    serviceLimit: state.licensing.limits.find(l => l.name === lookup?.services),
    evaluationDays,
  }
}
