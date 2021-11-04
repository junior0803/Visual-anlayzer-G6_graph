import React  from 'react';
import Header from '../layout';
import {Container} from 'react-bootstrap';
import {NodeSample} from './node'
import sampledata from '../data/sample.json'

export class Sample extends React.Component {

    render() {
        return(
            <div>
                <Header />
                <Container>
                    <div className="pt-3">
                        <NodeSample data={sampledata} />
                    </div>
                </Container>
            </div>
        )
    }
}