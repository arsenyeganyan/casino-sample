export default function PlayerDetail({ playerId }) {
  //rendering data for the selected player

  return (
    <div className="player--detail--container">
      <div className="detail--title">
        Showing statistics for player {playerId}
      </div>
    </div>
  )
}
