import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as ApiService from '../../api/ApiService';
import SearchInput from '../../components/SearchInput/SearchInput';

import './SchemaPanel.css';

class SchemaPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchSchemaName: '',
      schemas: []
    }
  }

  async componentDidMount() { 
    await this.fetchSchema();
  }

  fetchSchema = async() => {
    const {
      jdbcDataSourceId
    } = this.props;

    if (jdbcDataSourceId) {
      const { data: schemas = [] } = await ApiService.fetchDatabaseSchema(jdbcDataSourceId);
      this.setState({
        schemas
      });
    }
  }

  handleInputChange = (name, value, isNumber = false) => {
    let v = isNumber ? (parseInt(value, 10) || 0) : value;
    this.setState({
      [name]: v
    });
  }

  toggleSchemaColumns = (name) => {
    const { schemas = [] } = this.state;
    const index = schemas.findIndex(s => s.name === name);
    if (index !== -1) {
      const newSchemas = [...schemas];
      const { showColumns = false } = newSchemas[index];
      newSchemas[index].showColumns = !showColumns;
      this.setState({
        schemas: newSchemas
      });
    }
  }
  

  render() {
    const {
      searchSchemaName,
      schemas = []
    } = this.state;

    // Render the schema.
    const schemaItems = [];
    for (let i = 0; i < schemas.length; i++) {
      const table = schemas[i];
      const { 
        name,
        type,
        columns = [],
        showColumns = false
      } = table;
      if (!searchSchemaName || (searchSchemaName && name.includes(searchSchemaName))) {
        const columnItems = [];
        for (let j = 0; j < columns.length; j++) {
          const column = columns[j];
          columnItems.push(
            <div className="row schema-column-row">
              <div className="float-left schema-column-row-name">{column.name}</div>
              <div className="float-right schema-column-row-type">{column.dbType}({column.length})</div> 
            </div>
          );
        }
        schemaItems.push(
          <div>
            <div className="row schema-title-row" onClick={() => this.toggleSchemaColumns(name)}>
              <div className="float-left schema-title-row-name">{name}</div>
              <div className="float-right schema-title-row-type">{type}</div>
            </div>
            { showColumns && (
              <div>
                {columnItems}
              </div>
            )}
          </div>
        );
      }
    }

    return (
      <div className="schema-side-panel">
        <div>
          <button className="button square-button" style={{marginRight: '5px'}} onClick={this.fetchSchema}>
            <FontAwesomeIcon icon="redo-alt" />
          </button>
          <button className="button square-button" onClick={this.props.onClose}>
            <FontAwesomeIcon icon="times" />
          </button>
        </div>
        <div style={{margin: '8px 0px'}}>
          <SearchInput 
            name={'searchSchemaName'} 
            value={this.state.searchSchemaName} 
            onChange={this.handleInputChange} 
          />
        </div>
        <div>
          {schemaItems}
        </div>
      </div>
    );
  }
  
}

export default SchemaPanel;