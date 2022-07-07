const loadMyPage = (req, res) => {
    res.render('mypage.ejs', {user:req.session.user})
}

const checkIfLogged = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/login')
    }
}

const loadMyPartecip = (req,res) => {
    res.render('mypage.ejs', {user:req.session.user})
}

const loadAddEvent = (req,res) => {
    res.render('addevent.ejs', {user:req.session.user})
}

const addEventReq = (req,res) => {
    let {name, date, num, privacy, desc} = req.body;
    privacy = privacy == 'priv'
    num = num == ''? 0 : num
    let text = `
        INSERT INTO events(title,ddate,max_num_part,descr,priv,img,organizer,inv_code)
        VALUES ($1,$2,$3,$4,$5,$6,$7,substr(md5(random()::text), 0, 10))`
    let values = [name,date,num,desc,privacy,req.file,req.session.email]
    global.client.query(text, values, (err) => {
        if (err) console.log(err)
    })
    res.redirect('/profilo/miei')
}

const profRedirect = (req,res) => {
    res.redirect('/profilo/miei')
}

module.exports = {
    loadMyPage,
    checkIfLogged,
    loadMyPartecip,
    loadAddEvent,
    addEventReq,
    profRedirect
}