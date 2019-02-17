import React from 'react'
import wheel from '../../img/Bankwheel.svg'

const Bankwheel = () => {

	const size = {
		width: 40,
		height: 40
	}

	return (
		<div>
			<img style={size} src={wheel} alt="Loading wheel"/>
		</div>
	)
}

export default Bankwheel