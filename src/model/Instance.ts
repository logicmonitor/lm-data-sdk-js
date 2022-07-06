class Instance {
    instanceName!: string;
    instanceId: number | undefined;
    instanceDisplayName: string | undefined;
    instanceGroup: string | undefined;
    instanceProperties: any
}

export class InstanceBuilder {
    private _instance: Instance;

    constructor() {
        this._instance = new Instance();
    }

    setInstanceName(name: string): InstanceBuilder {
        this._instance.instanceName = name;
        return this;
    }

    setInstanceId(id: number): InstanceBuilder {
        this._instance.instanceId = id;
        return this;
    }

    setInstanceDisplayName(dName: string): InstanceBuilder {
        this._instance.instanceDisplayName = dName;
        return this;
    }

    setInstanceGroup(group: string): InstanceBuilder {
        this._instance.instanceGroup = group;
        return this;
    }

    setInstanceProperties(prop: any): InstanceBuilder {
        this._instance.instanceProperties = prop;
        return this;
    }

    build(): Instance{
        return this._instance;
    }
}