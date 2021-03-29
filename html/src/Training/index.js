import React from 'react';

const Training = (props={trainingStatus:[]}) =>{
    
    let ex = {
        "status": [
            {
                "epoch": 0,
                "batch": 91,
                "batch_log": {
                    "loss": 1.8173669576644897
                },
                "epoch_log": {
                    "loss": 1.8173669576644897,
                    "val_loss": 1.4942799806594849
                }
            },
            {
                "epoch": 1,
                "batch": 919,
                "batch_log": {
                    "loss": 1.3370625972747803
                },
                "epoch_log": {
                    "loss": 1.3370625972747803,
                    "val_loss": 1.244182825088501
                }
            },
            {
                "epoch": 2,
                "batch": 519,
                "batch_log": {
                    "loss": 1.1345912218093872
                },
                "epoch_log": {
                    "loss": 1.1345912218093872,
                    "val_loss": 1.0389714241027832
                }
            }
        ],
        "batchs": 919,
        "epochs": 3,
        "update_id": 1617041269.7174537
    }

    ex = props.trainingStatus

    return (
        <div className="training">
            <div className="title">
                Training
            </div>
            <div className="epochs">
                <div className="epoch">
                    <div className="epoch_number">
                        Importing Libraries
                    </div>
                </div>
                {
                    ex.status.length ? 
                    (
                        <div className="epoch">
                            <div className="epoch_number">
                                Starting Training
                            </div>
                        </div>
                    ):
                    undefined
                }
                {
                    ex.status.map((epoch,i)=>{
                        return (
                            <div key={i} className="epoch">
                                <div className="epoch_number">
                                    Epoch  { epoch.epoch + 1 } / {ex.epochs}
                                </div>
                                <div className="group">
                                    <div className="batch_number"> 
                                        Batch { epoch.batch } / { ex.batchs } 
                                    </div>
                                    <div className="progress">
                                        <div className="bar" style={{width:`${Math.floor((epoch.batch / ex.batchs)*100)}%`}}>

                                        </div>
                                    </div>
                                    {/* <div>
                                        <div>
                                            { epoch.batch_log.loss }
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Training;