import React from 'react';

const StrengthBar = ({ number }) => {
  const strength = calculateStrength(number);

  const styles = {
    container: {
      width: '30%',
      height: '10px',
      backgroundColor: '#ddd',
      borderRadius: '10px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: 'inset 1px 1px 1px rgba(0, 0, 0, 0.2)',
    },
    bar: {
      height: '100%',
      borderRadius: '10px',
      transition: 'width 0.3s ease-in-out',
      position: 'absolute',
      top: 0,
      left: 0,
      boxShadow: '1px 1px 1px rgba(0, 0, 0, 0.2)',
    },
    red: {
      backgroundColor: '#ff3d3d',
    },
    orange: {
      backgroundColor: '#ff9f3d',
    },
    green: {
      backgroundColor: '#66cc66',
    },
    label: {
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#555',
      textTransform: 'uppercase',
      marginBottom: '5px',
      textAlign: 'center',
    },
    separator: {
      width: '1px',
      height: '10px',
      backgroundColor: '#ccc',
      position: 'absolute',
      top: 0,
      right: '33.3%',
    },
  };

  const strengthLabels = {
    1: 'Weak',
    2: 'Medium',
    3: 'Strong',
  };

  let width = 0;
  let barStyle = styles.green;

  if (number > 1000) {
    width = 100;
    barStyle = styles.red;
  } else if (number > 500) {
    width = 66.6;
    barStyle = styles.orange;
  } else {
    width = 33.3;
  }

  const separatorCount = strength - 1;
  const separators = [];

  for (let i = 0; i < separatorCount; i++) {
    separators.push(<div key={i} style={styles.separator}></div>);
  }

  return (
    <div>
      <div style={styles.container}>
        <div style={{ ...styles.bar, ...barStyle, width: `${width}%` }}></div>
        {separators}
      </div>
      <div style={styles.label}>{strengthLabels[strength]}</div>
    </div>
  );
};

const calculateStrength = (number) => {
  if (number > 1000) {
    return 1;
  } else if (number > 500) {
    return 2;
  } else {
    return 3;
  }
};

export default StrengthBar;
