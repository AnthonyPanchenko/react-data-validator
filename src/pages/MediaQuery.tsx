import './media-query.scss';

export default function MediaQuery() {
  const ownersData = {
    securityNumber: 'ML73900753799',
    owners: [
      {
        name: 'John',
        documents: [
          { id: '1212', file: 'qwerty-1' },
          { id: '24234', file: 'qwerty-2' }
        ]
      }
    ]
  };

  console.log(ownersData);
  return (
    <div className="wrapper">
      <div className="box">1</div>
      <div className="box">2</div>
      <div className="box">3</div>
      <div className="box">4</div>
      <div className="box">5</div>
      <div className="box">6</div>
    </div>
  );
}
