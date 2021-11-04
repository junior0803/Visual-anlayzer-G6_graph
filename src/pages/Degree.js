import React from 'react';
import Header from '../layout';
import {Container} from 'react-bootstrap';
import DegreeGraph from './DegreeGraph';

class Degree extends React.Component {


    render() {
        return(
            <div>
                <Header />
                <Container>
                    <div className="pt-3">
                        <DegreeGraph data={this.props.data} mode={1}/>
                    </div>
                </Container>
            </div>
        )
    }
}

export default Degree