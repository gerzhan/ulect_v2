 # AutorespondSettingsController
    #
    # @description :: Server-side logic for managing Autorespondsettings
    # @help        :: See http://links.sailsjs.org/docs/controllers

module.exports = {

    getSettings: (req,res)->
        token =  req.token
        AutoresponseSettings.findOrCreate({AccountSid:token.AccountSid},{AccountSid:token.AccountSid}).exec(
            (err,settings)->
                if err
                    res.status err.status
                    res.json err
                else
                    res.json settings
        )


    saveSettings: (req,res)->
        token =  req.token
        params = req.params.all()
        console.log params
        if !params?.type?
            res.status 418
            res.json msg: "Type settings error"
        else
            AutoresponseSettings.findOne({AccountSid:token.AccountSid}).exec(
                (err,settings)->
                    if err
                        res.status err.status
                        res.json err
                    else
                        if params?.A1?
                            settings.A1 =  params.A1
                        if params?.A2?
                            settings.A2 =  params.A2
                        settings.save(
                            (err)->
                              if err
                                    res.json err
                              else
                                res.json settings
                        ) 
            )

}