import axios from "axios";
import { ToyModel } from "../models/toy.model";
import { TypeModel } from "../models/toyType.model";
import { AgeGroupModel } from "../models/toyAge.model";

const client = axios.create({
    baseURL: 'https://toy.pequla.com/api',
    headers: {
        'Accept': 'application/json',
        'X-Name': 'ICR/2025'
    }
})

export class ToyService {
    static async getToys(search: string = '',
        category: string | null = null,
        ageGroup: string | null = null,
        description: string | null = null,
        targetGroup: string | null = null,
        productionDate: string | null = null,
        price: string | null = null) {
        const rsp = (await client.get<ToyModel[]>(`/toy`))
        const toys = rsp.data

        return toys.filter(
            (toy) =>
                (toy.name.toLowerCase().includes(search.toLowerCase()) ||
                toy.description.toLowerCase().includes(search.toLowerCase()) ||
                toy.type.name.toLowerCase().includes(search.toLowerCase())) &&
                ((!category || toy.type.name.toLowerCase().includes(category.toLowerCase())) &&
                (!ageGroup || toy.ageGroup.name?.toLowerCase().includes(ageGroup.toLowerCase())) &&
                (!description || toy.description.toLowerCase().includes(description.toLowerCase())) &&
                (!targetGroup || toy.targetGroup?.toLowerCase().includes(targetGroup.toLowerCase())) &&
                (!productionDate || toy.productionDate === productionDate) &&
                (!price || toy.price <= parseFloat(price)))
        )

    }

    static async getToyByPermalink(permalink: string) {
        return (await client.get<ToyModel>(`/toy/permalink/${permalink}`)).data
    }

    static async getToyCategories() {
        return (await client.get<TypeModel[]>('/type')).data
    }

    static async getAgeGroups() {
        return (await client.get<AgeGroupModel[]>('/age-group')).data
    }
}