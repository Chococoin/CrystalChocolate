import React from 'react'
import wheel from '../../img/Bankwheel.svg'

const Bankwheel = () => {

	const size = {
		width: 40,
		height: 40
	}

	return (
		<React.Fragment>
			<img style={size} src={wheel} alt="Loading wheel"/>
		</React.Fragment>
	)
}

export default Bankwheel