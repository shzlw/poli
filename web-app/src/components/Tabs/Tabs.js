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
      children,
      showTabBgColor = false
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
        let tabStyle = {};
        if (title === activeTab) {
          active = 'tab-header-active';
          tabContent = children[i].props.children;
          tabStyle = showTabBgColor ? {backgroundColor: '#FFFFFF'} : {};
        }

        tabHeaders.push(
          <li className={`tab-header-item ${active}`} style={tabStyle} key={title} onClick={() => this.handleTabClick(title)}>
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

