export default function Card ({ cardObj, view, viewHintBool }) {

  if (!cardObj) {
    return null
  }
  let output = '';
  if (viewHintBool) {
    output = '<pre>' + cardObj.hintCategory + ":" + cardObj.hint + '</pre>';
  } else if (view === 'q') {
    output = '<pre>Q: ' + cardObj.question + '</pre>';
  } else if (view === 'a') {
    output = "<pre>" + cardObj.answer + "</pre>";
  }

  return <div className="card">
    <div style={{clear:"both"}} dangerouslySetInnerHTML={{ __html: output }} />
  </div>
}



