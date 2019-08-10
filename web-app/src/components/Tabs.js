import React from 'react';
import './Tabs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Tabs extends React.Component {

  handleTabClick = (title) => {
    this.props.onTabChange(title);
  }

  render() {
    const {
      activeTab,
      children
    } = this.props;

    const tabHeaders = [];
    let tabContent = null;
    for (let i = 0; i < children.length; i++) {
      if (children[i]) {
        const { 
          title,
          icon,
          iconOnly = false
        } = children[i].props;
        
        let active = '';
        if (title === activeTab) {
          active = 'tab-header-active';
          tabContent = children[i].props.children;
        }
        
        tabHeaders.push(
          <li className={`tab-header-item ${active}`} key={i} onClick={() => this.handleTabClick(title)}>
            { iconOnly ? (
              <FontAwesomeIcon icon={icon} size="lg" />
            ) : (
              <React.Fragment>{title}</React.Fragment>
            )}
          </li>
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

