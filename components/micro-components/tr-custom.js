import React from "react";
import "../../styles/main.scss";
import { DAILIES_SCORE_ARRAY_MAP } from '../../constants/dailies';

const TrCustom = ({ address, id, score, tweetUrl, setVisibleData, showCopyCode }) => {
  const _handlerOnHover = (event, id) => {
    const oRect = event.currentTarget.getBoundingClientRect(),
      position = {
        x: oRect.x,
        y: oRect.top + window.pageYOffset
      };

    setVisibleData({ visible: true, position, data: id });
  };

  const copyCodeToClipboard = (aux) => {
    navigator.clipboard.writeText(aux);
    showCopyCode();
  };

  const breakdownScorePerId = (id, score) => {
    let pointsFromDailies = 0;
    const dailiesBreakdown = DAILIES_SCORE_ARRAY_MAP.map(dailyScore => {
      pointsFromDailies += +dailyScore.daily[id] || 0;
      return `${dailyScore.name}: ${dailyScore.daily[id] || 0}/${dailyScore.maxPoints}`
    })
    const coverbotPoints = +score - pointsFromDailies;
    dailiesBreakdown.push(`Coverbot: ${coverbotPoints}`)
    return dailiesBreakdown.join('\n')
  }

  return (
    <tr key={id}>
      <td 
        data-type="score"
        data-label="score"
        onMouseEnter={(event) => _handlerOnHover(event, breakdownScorePerId(id, score))}
        onMouseLeave={() => setVisibleData({ visible: false, position: {}, data: '' })}
      >
        {score}
      </td>
      <td data-label="address" data-raw={address}>
        <a
          className="table-link-on"
          target="_blank"
          href={"https://explorer.matic.network/address/" + address}
          rel="noopener noreferrer"
        >
          <img src="/assets/icons/link.svg" alt="link" />
          <div> {address.slice(0, 5)}<span>...</span>{address.slice(-5)}</div>
        </a>
      </td>
      <td
        data-label="id"
        data-raw={id}
        onClick={() => copyCodeToClipboard(id)}
        onMouseEnter={(event) => _handlerOnHover(event, id)}
        onMouseLeave={() => setVisibleData({ visible: false, position: {}, data: '' })}
      >
        <div><img src="/assets/icons/copy.svg" alt="copy" /> {id.slice(0, 5)}<span>...</span>{id.slice(-5)}</div>
      </td>
      <td data-label="tweetUrl">
        <a target="_blank" href={tweetUrl} rel="noopener noreferrer">
          <img src="/assets/icons/twitter.svg" alt="twitter" />
        </a>
      </td>
    </tr>
  );
};

export default TrCustom;
