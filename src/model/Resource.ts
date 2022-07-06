class Resource {

    resourceIds: any;

    resourceName: string | undefined;
    description: string | undefined;

    resourceProperties: any;

    create: boolean | undefined;

}

export class ResourceBuilder {

    private _resource: Resource;

    constructor() {
        this._resource = new Resource();
    }

    setResourceIds(resourceIds: any): ResourceBuilder {
        this._resource.resourceIds = resourceIds;
        return this;
    }

    setResourceName(resourceName: string): ResourceBuilder {
        this._resource.resourceName = resourceName;
        return this;
    }

    setDescription(description: string): ResourceBuilder {
        this._resource.description = description;
        return this;
    }

    setCreate(create: boolean): ResourceBuilder {
        this._resource.create = create;
        return this;
    }

    setProperties(properties: any): ResourceBuilder {
        this._resource.resourceProperties = properties;
        return this;
    }

    build(): Resource {
        return this._resource;
    }
}