class DataSource {
    dataSource!: string;
    dataSourceDisplayName: string | undefined;
    dataSourceGroup: string | undefined;
    dataSourceId!: number;
    singleInstanceDS: boolean | undefined;
}

export class DataSourceBuilder {
    private _dataSource: DataSource;

    constructor() {
        this._dataSource = new DataSource();
    }

    setDataSource(name: string): DataSourceBuilder {
        this._dataSource.dataSource = name;
        return this;
    }

    setDataSourceDisplayName(displayName: string): DataSourceBuilder {
        this._dataSource.dataSourceDisplayName = displayName;
        return this;
    }

    setDataSourceGroup(groupName: string): DataSourceBuilder {
        this._dataSource.dataSourceGroup = groupName;
        return this;
    }

    setDataSourceId(id: number): DataSourceBuilder {
        this._dataSource.dataSourceId = id;
        return this;
    }

    setSingleInstanceDS(): DataSourceBuilder {
        this._dataSource.singleInstanceDS = true;
        return this;
    }

    build(): DataSource {
        return this._dataSource;
    }

}