import React from 'react';
import './Tabs.css';

class Tabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
    };
  }

  componentDidMount() {
    const activeTab = this.props.activeTab;
    this.setState({
      activeTab: activeTab
    });
  }

  handleTabClick = (title) => {
    this.setState({
      activeTab: title
    });
  }

  render() {
    const {
      children
    } = this.props;

    const {
      activeTab
    } = this.state;

    const tabHeaders = [];
    let tabContent = null;
    for (let i = 0; i < children.length; i++) {
      if (children[i]) {
        const title = children[i].props.title;
        let active = '';
        if (title === activeTab) {
          active = 'tab-header-active';
          tabContent = children[i].props.children;
        }
        
        tabHeaders.push(
          <li className={`tab-header-item ${active}`} key={i} onClick={() => this.handleTabClick(title)}>{title}</li>
        );
      }
    }
    
    return (
      <div className="tab-container">
        <ul className="tab-header">
          {tabHeaders}
        </ul>
        <div className="tab-content">
          {tabContent}
        </div>
      </div>
    );
  }
}

export default Tabs;

