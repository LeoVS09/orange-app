// @ts-ignore next-line
global.fetch = require('node-fetch')
jest.unmock('graphql-tag');
import { createLocalVue, mount } from '@vue/test-utils'
import { VueConstructor } from 'vue'
import Vuex, { Store } from 'vuex'
import cons from './utils/console.mock'
import vuexI18n from 'vuex-i18n'
import moment from 'moment'

describe('ProblemsList.vue', () => {

    let localVue: VueConstructor<any>
    let store: Store<any>

    beforeEach(async () => {
        localVue = createLocalVue()
        localVue.use(Vuex)
        store = new Store({
            getters: {
                isTeacher: () => true
            }
        })

        localVue.use(vuexI18n.plugin, store)

        moment.now = function () {
            return +new Date('2020-03-17T19:54:57.551Z')
        }

        cons.mockConsole()
    })

    afterEach(() => {
        cons.restoreConsole()
    });

    it('renders problems empty list', async () => {
        // must be inside test for mock fetch function
        const Component = require('@/containers/ProblemsList.vue').default

        const wrapper = mount(Component, {
            store,
            localVue,
            attachToDocument: true,
            propsData: {
                problems: [],
                tags: []
            }
        })

        expect(wrapper.element).toMatchSnapshot()
    })

    it('renders problems list with data', async () => {
        // must be inside test for mock fetch function
        const Component = require('@/containers/ProblemsList.vue').default

        const propsData = {
            tags: [
                {
                    "id": "84eeqrOG",
                    "name": "magni",
                },
                {
                    "id": "-zU_J_u5m",
                    "name": "id",
                }, {
                    "id": "lkV6JPU1Q",
                    "name": "dolore",
                }, {
                    "id": "NUrRCq7RH",
                    "name": "sit",
                }, {
                    "id": "LLSgR5skV",
                    "name": "corrupti",
                }, {
                    "id": "ytCvo8T2n",
                    "name": "officia",
                }
            ],

            problems: [
                {
                    "id": "3-94HIeA",
                    "name": "Optio ratione",
                    "difficulty": 7, 
                    "updatedAt": "2020-03-03T00:17:06+03:00",
                    "author": {
                        "id": "UnybUQr-7",
                        "user": {
                            "id": "Z8OJE6H_2",
                            "name": "Miss Lavada Hoeger",
                            "username": "Kris.Ralph",
                        },
                    },
                },
                {
                    "id": "gWYD0tEs-",
                    "name": "Molestias architecto aut",
                    "difficulty": 23,
                    "updatedAt": "2020-03-07T00:17:06+03:00",
                    "author": {
                        "id": "MTl2WdTlo",
                        "user": {
                            "id": "vIL8ocV9T",
                            "name": "Mr. Wilma Corkery",
                            "username": "Amos_Bahringer",
                        },

                    },

                },
                {
                    "id": "s3MZYq61U",
                    "name": "Autem et aliquid",
                    "difficulty": 14,
                    "updatedAt": "2020-02-28T00:17:06+03:00",
                    "author": {
                        "id": "2FFCJeGk0",
                        "user": {
                            "id": "JwPuMA3zL",
                            "name": "Ms. Maynard Abbott",
                            "username": "Rohan_Queenie",
                        },

                    },

                },
                {
                    "id": "59RXC4jNZ",
                    "name": "Unde possimus",
                    "difficulty": 8,
                    "updatedAt": "2020-03-03T00:17:06+03:00",
                    "author": {
                        "id": "f23Jhe-jb",
                        "user": {
                            "id": "7DNJM4yfO",
                            "name": "Mrs. Hardy Herzog",
                            "username": "Paris_White",

                        },

                    },

                },
                {
                    "id": "Wowp1B5Lg",
                    "name": "Enim non", "difficulty": 11,
                    "updatedAt": "2020-03-11T00:17:06+03:00",
                    "author": {
                        "id": "y0cyRTGlp",
                        "user": {
                            "id": "H5OKBBSvj",
                            "name": "Miss Furman Bernier",
                            "username": "Jaskolski.Sanford",

                        },
                    },
                }, {
                    "id": "IoVOwsZDY",
                    "name": "Nobis dolor",
                    "difficulty": 14,
                    "updatedAt": "2020-03-05T00:17:06+03:00",
                    "author": {
                        "id": "-gosqOdAXy",
                        "user": {
                            "id": "-JHYmCIl6A",

                            "name": "Mr. Stacey Bradtke",
                            "username": "Mitchell.Timmy",

                        },

                    },

                }, {
                    "id": "OsY9Ng05IE",
                    "name": "Necessitatibus temporibus enim",
                    "difficulty": 11,
                    "updatedAt": "2020-03-07T00:17:06+03:00",
                    "author": {
                        "id": "XANEhLZ57B",
                        "user": {
                            "id": "WjSgpEH9Fq",
                            "name": "Mrs. Hildegard Jerde",
                            "username": "Wolff.Tara",

                        },
                    },
                }, {
                    "id": "k1-FSJ0cyg",
                    "name": "Et architecto quia",
                    "difficulty": 11,
                    "updatedAt": "2020-03-11T00:17:06+03:00",
                    "author": {
                        "id": "yvuNRfUB8C",
                        "user": {
                            "id": "ls6Ij-2PPb",
                            "name": "Miss Karelle Feeney", 
                            "username": "Maya_Stiedemann",

                        },
                    },
                },
                {
                    "id": "Pr0x9D_Zr0",
                    "name": "Totam et", "difficulty": 21,
                    "updatedAt": "2020-03-12T00:17:06+03:00",
                    "author": {
                        "id": "76ilyaQGBi",

                        "user": {
                            "id": "h4vMurc7C7",
                            "name": "Mrs. Candelario Denesik",
                            "username": "Mattie_Legros",
                        },
                    },
                },
                {
                    "id": "wURbFFJpVF",
                    "name": "Suscipit dolor nihil",
                    "difficulty": 5,
                    "updatedAt": "2020-03-02T00:17:06+03:00",
                    "author": {
                        "id": "XvZF_cfc6L",
                        "user": {
                            "id": "Q4TOz40ZPd",
                            "name": "Mrs. Yasmine Skiles",
                            "username": "Julian_Morar",
                        },
                    },
                },
                {
                    "id": "KXKTHnG97g",
                    "name": "Deserunt inventore",
                    "difficulty": 12,
                    "updatedAt": "2020-03-09T00:17:06+03:00",
                    "author": {
                        "id": "cVi_7c103N",
                        "user": {
                            "id": "6ZAFbpcQuo",
                            "name": "Ms. Danial Cronin",
                            "username": "Cassin_Melody",
                        },
                    },
                },
                {
                    "id": "VQuc6QMJBy",
                    "name": "Maxime est",
                    "difficulty": 6,
                    "updatedAt": "2020-03-01T00:17:06+03:00",
                    "author": {
                        "id": "o6Uu1txQUs",
                        "user": {
                            "id": "29JdysnsQA",
                            "name": "Miss Conor Konopelski", 
                            "username": "Borer_Ramiro",
                        },

                    },
                }, {
                    "id": "2Ni-D7tkKH",
                    "name": "Et nemo",
                    "difficulty": 19,
                    "updatedAt": "2020-03-04T00:17:06+03:00",
                    "author": {
                        "id": "0KvNfusSlr",
                        "user": {
                            "id": "jJjbkqv75e",
                            "name": "Dr. Layla Weimann",
                            "username": "Kirstin_Fay",
                        },
                    },
                }, {
                    "id": "SRXAMahPtL",
                    "name": "Distinctio consectetur",
                    "difficulty": 24,
                    "updatedAt": "2020-03-02T00:17:06+03:00",
                    "author": {
                        "id": "GCj6p9_jNB",
                        "user": {
                            "id": "stVZOkr-HO",
                            "name": "Mr. Keith Prohaska",
                            "username": "Sincere.Abshire",
                        },
                    },
                }, {
                    "id": "tr4YkUrSfw",
                    "name": "Odit id",
                    "difficulty": 9,
                    "updatedAt": "2020-02-28T00:17:06+03:00",
                    "author": {
                        "id": "aYohCUUT5D",
                        "user": {
                            "id": "UWDsLDFO-2",
                            "name": "Miss Lempi Stiedemann",
                            "username": "Connelly_Carson",
                        },
                    },
                }, {
                    "id": "S-HM_z0mlv",
                    "name": "Quo nesciunt quam",
                    "difficulty": 12,
                    "updatedAt": "2020-02-23T00:17:06+03:00",
                    "author": {
                        "id": "QpKnuqXatV",
                        "user": {
                            "id": "c99UDfvO3D",
                            "name": "Miss Cyrus Schiller", "username": "Adams.Wilbert",
                        },

                    },
                }, {
                    "id": "-EnB-ClQsO",
                    "name": "Cupiditate dolores voluptatem",
                    "difficulty": 24, 
                    "updatedAt": "2020-03-06T00:17:06+03:00",
                    "author": {
                        "id": "PNSA6YlDWD", "user": {
                            "id": "Fkxwo1VAfL",
                            "name": "Ms. Florencio Nienow",
                            "username": "Lincoln_Bradtke",

                        },

                    },
                }, {
                    "id": "WhyFwCsJUy",
                    "name": "Est error quasi", 
                    "difficulty": 13,
                    "updatedAt": "2020-03-09T00:17:06+03:00",
                    "author": {
                        "id": "aRbxyRl0Nt",
                        "user": {
                            "id": "B_Fp4v9oeB",

                            "name": "Mrs. Wiley Cremin",
                            "username": "Hanna_Morissette",
                        },
                    },
                }
            ]
        }

        const wrapper = mount(Component, {
            store,
            localVue,
            attachToDocument: true,
            propsData
        })

        await wrapper.vm.$nextTick()

        expect(wrapper.text()).toContain('dolore')
        expect(wrapper.text()).toContain('corrupti')
        expect(wrapper.text()).toContain('officia')
        expect(wrapper.text()).toContain('Mrs. Hildegard Jerde')
        expect(wrapper.text()).toContain('11 days ago')

        expect(wrapper.element).toMatchSnapshot()
    })
})
